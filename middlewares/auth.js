import catchAsyncErrors from "./catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { getSession } from "next-auth/react";

const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const session = await getSession({ req });

  if (!session) {
    return next(new ErrorHandler("Login first to access this resource"));
  }

  req.user = session.user;
  next();
});

//handle user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} cannot allow this resource`, 403));
    }
    next();
  };
};

export default isUserAuthenticated;
export { authorizeRoles };
