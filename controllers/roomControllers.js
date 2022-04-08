import Room from "../models/room";
import Booking from "../models/booking";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import APIFeatures from "../utils/apiFeatures";

// get all rooms => api/rooms
const allRooms = catchAsyncErrors(async (req, res) => {
  const resPerPage = 4;
  const roomsCount = await Room.countDocuments();

  const apiFeatures = new APIFeatures(Room.find(), req.query).search().filter();

  let rooms = await apiFeatures.query;
  const filteredRoomsCount = rooms.length;

  apiFeatures.pagination(resPerPage);
  rooms = await apiFeatures.query;

  res.status(200).json({ success: true, roomsCount, resPerPage, filteredRoomsCount, rooms });
});

// create a new room => api/rooms
const newRoom = catchAsyncErrors(async (req, res) => {
  const images = req.body.images;

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "bookit/rooms",
    });

    imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  console.log(req.body);

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    room,
  });
});

// get room details => api/rooms/:id
const getSingleRoom = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});

// update room details => api/rooms/:id
const updateRoom = catchAsyncErrors(async (req, res, next) => {
  let room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  let imagesLinks = [];

  if (req.body.images) {
    //delete images associated with the room
    for (let i = 0; i < room.images.length; i++) {
      await cloudinary.v2.uploader.destroy(room.images[i].public_id);
    }

    for (let i = 0; i < req.body.images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(req.body.images[i], {
        folder: "bookit/rooms",
      });

      imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
    }

    req.body.images = imagesLinks;
  }

  console.log("r", req.body);

  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    room,
  });
});

// delete room => api/rooms/:id
const deleteRoom = catchAsyncErrors(async (req, res) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  //delete images associated with the room
  for (let i = 0; i < room.images.length; i++) {
    await cloudinary.v2.uploader.destroy(room.images[i].public_id);
  }

  await room.remove();

  res.status(200).json({
    success: true,
    message: "Room is removed successfully",
  });
});

// create a new review => api/rewiew
const createRoomReview = catchAsyncErrors(async (req, res) => {
  const { rating, comment, roomId, name } = req.body;

  console.log({ name });
  const review = {
    user: req.user._id,
    name,
    rating: Number(rating),
    comment,
  };

  const room = await Room.findById(roomId);

  const isReviewed = room.reviews.find((r) => r.user.toString() === req.user._id.toString());

  if (isReviewed) {
    room.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    room.reviews.push(review);
    room.numOfReviews = room.reviews.length;
  }

  room.ratings = room.reviews.reduce((acc, item) => item.rating + acc, 0) / room.reviews.length;

  await room.save({ validateBeforeSave: false });

  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Room is removed successfully",
  });
});

// check review availablity => api/reviews/check_review_availablity
const checkReviewAvailablity = catchAsyncErrors(async (req, res) => {
  const { roomId } = req.query;

  const bookings = await Booking.find({ user: req.user._id, room: roomId });

  let isReviewAvailable = false;
  if (bookings.length > 0) {
    isReviewAvailable = true;
  }

  res.status(200).json({
    success: true,
    isReviewAvailable,
  });
});

// get all rooms - ADMIN => api/admin/rooms
const allAdminRooms = catchAsyncErrors(async (req, res) => {
  const rooms = await Room.find();

  res.status(200).json({
    success: true,
    rooms,
  });
});

// get all room reviews - ADMIN => api/reviewes
const getRoomReviwes = catchAsyncErrors(async (req, res) => {
  const room = await Room.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: room.reviews,
  });
});

// delete room review - ADMIN => api/reviews
const deleteReview = catchAsyncErrors(async (req, res) => {
  const room = await Room.findById(req.query.roomId);

  const reviews = room.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings = room.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Room.findByIdAndUpdate(
    req.query.roomId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
  });
});

export {
  allRooms,
  newRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  createRoomReview,
  checkReviewAvailablity,
  allAdminRooms,
  getRoomReviwes,
  deleteReview,
};
