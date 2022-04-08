import User from "../models/user";
import cloudinary from "cloudinary";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import APIFeatures from "../utils/apiFeatures";
import absoluteUrl from "next-absolute-url";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

// setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// register user => api/auth/register
const registerUser = catchAsyncErrors(async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "bookit/avatars",
    width: "150",
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
});

// current user profile => api/me
const currentUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile => api/me/update
const updateUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
  }

  if (req.body.avatar !== "") {
    const image_id = user.avatar.public_id;

    // delete user prev image
    await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "bookit/avatars",
      width: "150",
      crop: "scale",
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
  });
});

// reset password => api/password/forgot
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return new ErrorHandler("User not found with this email", 404);
  }

  // get reset token
  const resetToken = await user.getResetPasswordToken();

  console.log({ resetToken });

  await user.save({ validateBeforeSave: false });

  // get origin
  const { origin } = absoluteUrl(req);

  // create reset password url
  const resetUrl = `${origin}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follow: \n \n ${resetUrl} \n \n 
  If you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "BookIt Password Recovery",
      message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500);
  }

  res.status(200).json({
    success: true,
    message: `Email send to ${user.email}`,
  });
});

// reset password => api/password/reset/:token
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // hash url token
  console.log("func");
  const resetPasswordToken = crypto.createHash("sha256").update(req.query.token).digest("hex");

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// get users - ADMIN => api/admin/users
const allAdminUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get user details - ADMIN => api/admin/users/:id
const getUsersDetails = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return new ErrorHandler("User not found with this ID", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user details - ADMIN => api/admin/users/:id
const updateUser = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// delete user - ADMIN => api/admin/users/:id
const deleteUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return new ErrorHandler("User not found with this ID", 404);
  }

  //remove avatar
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
    user,
  });
});

export {
  registerUser,
  currentUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  allAdminUsers,
  getUsersDetails,
  updateUser,
  deleteUser,
};
