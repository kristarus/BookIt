import { combineReducers } from "redux";
import {
  allRoomsReducer,
  roomDetailsReducer,
  newReviewReducer,
  checkReviewReducer,
  newRoomReducer,
  roomReducer,
  roomReviewsReducer,
  reviewReducer,
} from "./roomReducers";
import {
  authReducer,
  userReducer,
  forgotPasswordReducer,
  resetPasswordReducer,
  loadedUserReducer,
  allUsersReducer,
  userDetailsReducer,
} from "./userReducers";
import {
  checkBookingReducer,
  bookedDatesReducer,
  bookingsReducer,
  bookingDetailsReducer,
  bookingReducer,
} from "./bookingReducer";

const reducers = combineReducers({
  allRooms: allRoomsReducer,
  roomDetails: roomDetailsReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  loadedUser: loadedUserReducer,
  checkBooking: checkBookingReducer,
  bookedDates: bookedDatesReducer,
  bookings: bookingsReducer,
  bookingDetails: bookingDetailsReducer,
  booking: bookingReducer,
  newReview: newReviewReducer,
  checkReview: checkReviewReducer,
  roomReviews: roomReviewsReducer,
  newRoom: newRoomReducer,
  room: roomReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  review: reviewReducer,
});

export default reducers;
