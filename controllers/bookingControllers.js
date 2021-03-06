import Booking from "../models/booking";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

// create new booking => api/bookings
const newBooking = catchAsyncErrors(async (req, res) => {
  const { room, checkInDate, checkOutDate, daysOfStay, amountPaid, paymentInfo } = req.body;

  const booking = await Booking.create({
    room,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
    paidAt: Date.now(),
  });

  res.status(200).json({
    success: true,
    booking,
  });
});

// check room booking availability => api/bookings/check
const checkRoomBookingAvailability = catchAsyncErrors(async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.query;

  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);

  const bookings = await Booking.find({
    room: roomId,
    $and: [
      {
        checkInDate: {
          $lte: outDate,
        },
      },
      {
        checkOutDate: {
          $gte: inDate,
        },
      },
    ],
  });

  // check if there is any bookings available
  let isAvailable;

  if (bookings && bookings.length === 0) {
    isAvailable = true;
  } else {
    isAvailable = false;
  }

  res.status(200).json({
    success: true,
    isAvailable,
  });
});

// check booked dates of a room => api/bookings/check_booked_dates
const checkBookedDatesOfRoom = catchAsyncErrors(async (req, res) => {
  const { roomId } = req.query;
  console.log({ roomId });

  const bookings = await Booking.find({ room: roomId });

  let bookedDates = [];
  const timeDifference = moment().utcOffset() / 60;

  bookings.forEach((booking) => {
    const checkInDate = moment(booking.checkInDate).add(timeDifference, "hours");
    const checkOutDate = moment(booking.checkOutDate).add(timeDifference, "hours");

    const range = moment.range(moment(checkInDate), moment(checkOutDate));

    const dates = Array.from(range.by("day"));

    bookedDates = bookedDates.concat(dates);
  });

  res.status(200).json({
    success: true,
    bookedDates,
  });
});

// get all bookings from user => api/bookings/me
const myBookings = catchAsyncErrors(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// get all bookings - ADMIN => api/admin/bookings
const allAdminBookings = catchAsyncErrors(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// delete booking - ADMIN => api/admin/bookings/:id
const deleteBooking = catchAsyncErrors(async (req, res) => {
  const booking = await Booking.findById(req.query.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  await booking.remove();

  res.status(200).json({
    isDeleted: true,
  });
});

// get booking details => api/bookings/:id
const getBookingDetails = catchAsyncErrors(async (req, res) => {
  const booking = await Booking.findById(req.query.id)
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    booking,
  });
});

export {
  newBooking,
  checkRoomBookingAvailability,
  checkBookedDatesOfRoom,
  myBookings,
  getBookingDetails,
  allAdminBookings,
  deleteBooking,
};
