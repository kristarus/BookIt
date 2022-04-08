import {
  CHECK_BOOKING_SUCCESS,
  CHECK_BOOKING_RESET,
  CHECK_BOOKING_FAIL,
  CHECK_BOOKING_REQUEST,
  BOOKED_DATES_SUCCESS,
  BOOKED_DATES_FAIL,
  MY_BOOKINGS_FAIL,
  MY_BOOKINGS_SUCCESS,
  BOOKING_DETAILS_FAIL,
  BOOKING_DETAILS_SUCCESS,
  ADMIN_BOOKINGS_SUCCESS,
  ADMIN_BOOKINGS_FAIL,
  ADMIN_BOOKINGS_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAIL,
  DELETE_BOOKING_REQUEST,
  CLEAR_ERRORS,
} from "../constants/bookingConstants";
import axios from "axios";
import absoluteUrl from "next-absolute-url";

// check booking
export const checkBooking = (roomId, checkInDate, checkOutDate) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_BOOKING_REQUEST });

    let link = `/api/bookings/check?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;

    const { data } = await axios.get(link);

    dispatch({ type: CHECK_BOOKING_SUCCESS, payload: data.isAvailable });
  } catch (error) {
    dispatch({
      type: CHECK_BOOKING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get booked dates
export const getBookedDates = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/bookings/check_booked_dates?roomId=${id}`);

    console.log("b", data.bookedDates);

    dispatch({ type: BOOKED_DATES_SUCCESS, payload: data.bookedDates });
  } catch (error) {
    dispatch({
      type: BOOKED_DATES_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get booked dates
export const myBookings = (authCookie, req) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        cookie: authCookie,
      },
    };
    const { data } = await axios.get(`${origin}/api/bookings/me`, config);

    dispatch({ type: MY_BOOKINGS_SUCCESS, payload: data.bookings });
  } catch (error) {
    dispatch({
      type: MY_BOOKINGS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get booked dates
export const getAdminBookings = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BOOKINGS_REQUEST });

    const { data } = await axios.get(`/api/admin/bookings`);

    dispatch({ type: ADMIN_BOOKINGS_SUCCESS, payload: data.bookings });
  } catch (error) {
    dispatch({
      type: ADMIN_BOOKINGS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get booked dates
export const deleteBooking = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BOOKING_REQUEST });
    console.log("start");
    const { data } = await axios.delete(`/api/admin/bookings/${id}`);
    console.log(data);

    dispatch({ type: DELETE_BOOKING_SUCCESS, payload: data.isDeleted });
  } catch (error) {
    console.log(error);
    dispatch({
      type: DELETE_BOOKING_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get booked dates
export const getBookingDetails = (authCookie, req, id) => async (dispatch) => {
  try {
    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        cookie: authCookie,
      },
    };
    const { data } = await axios.get(`${origin}/api/bookings/${id}`, config);

    console.log(data);

    dispatch({ type: BOOKING_DETAILS_SUCCESS, payload: data.booking });
  } catch (error) {
    dispatch({
      type: BOOKING_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
