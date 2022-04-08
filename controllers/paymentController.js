import Room from "../models/room";
import User from "../models/user";
import Booking from "../models/booking";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import absolute from "next-absolute-url";

// generate paypal checkout session => api/checkout/:roomId
const paypalCheckoutSession = catchAsyncErrors(async (req, res) => {
  const room = await Room.findById(req.query.roomId);

  res.status(200).json({ success: true, roomsCount, resPerPage, filteredRoomsCount, rooms });
});
