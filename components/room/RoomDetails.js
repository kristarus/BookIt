import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Carousel, CarouselItem } from "react-bootstrap";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import RoomFeatures from "./RoomFeatures";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/router";
import { checkBooking, getBookedDates } from "../../redux/actions/bookingActions";
import { CHECK_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NewReview from "../review/NewReview";
import ListReviews from "../review/ListReviews";

const RoomDetails = ({ title }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { rooms, error } = useSelector((state) => state.roomDetails);
  const { user } = useSelector((state) => state.loadedUser);
  const { dates } = useSelector((state) => state.bookedDates);
  const {
    available,
    loading: bookingLoading,
    error: lalala,
  } = useSelector((state) => state.checkBooking);

  const excludedDates = [];
  dates &&
    dates.forEach((date) => {
      excludedDates.push(new Date(date));
    });

  const onChange = (dates) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      const days = Math.floor((new Date(checkOutDate) - new Date(checkInDate)) / 86400000 + 1);

      setDaysOfStay(days);

      dispatch(checkBooking(id, checkInDate.toISOString(), checkOutDate.toISOString()));
    }
  };

  const { id } = router.query;

  const newBookingHandler = async (id, status) => {
    const bookingData = {
      room: router.query.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: rooms.pricePerNight * daysOfStay,
      paymentInfo: {
        id,
        status,
      },
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/bookings", bookingData, config);

      if (data.success) {
        toast.success("Room is booked successfully");
      }
      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  const addPaymentbutton = () => {
    return (
      <PayPalScriptProvider options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}>
        <PayPalButtons
          style={{ color: "blue" }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              newBookingHandler(details.id, details.status);
            });
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: rooms.pricePerNight * daysOfStay,
                  },
                },
              ],
            });
          }}
        />
      </PayPalScriptProvider>
    );
  };

  useEffect(() => {
    dispatch(getBookedDates(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    return () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{rooms.name} - BookIt</title>
      </Head>
      <div className="container container-fluid">
        <h2 className="mt-5">{rooms.name}</h2>
        <p>{rooms.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div className="rating-inner"></div>
          </div>
          <span id="no_of_reviews" style={{ width: `${(rooms.rating / 5) * 100}%` }}>
            ({rooms.numOfReviews} Reviews)
          </span>
        </div>

        <Carousel hover="pause">
          {rooms.images &&
            rooms.images.map((image) => (
              <CarouselItem key={image.public_id}>
                <div style={{ width: "100%", height: "440px", position: "relative" }}>
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    alt={rooms.name}
                    layout="fill"
                    priority={true}
                  />
                </div>
              </CarouselItem>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{rooms.description}</p>

            <RoomFeatures room={rooms} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>{rooms.pricePerNight}</b> / night
              </p>

              <hr />

              <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>

              <DatePicker
                className="w-100 "
                selected={checkInDate}
                onChange={onChange}
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                excludeDates={excludedDates}
                selectsRange
                inline
              />

              {available && (
                <div className="alert-success my-3 font-weight-bold">
                  Book is available. Book now!
                </div>
              )}

              {!available && available !== undefined && (
                <div className="alert-danger my-3 font-weight-bold">
                  Book is not available. Try other dates
                </div>
              )}

              {!available && !user && (
                <div className="alert-danger my-3 font-weight-bold">Login to book the room.</div>
              )}

              {available && user && daysOfStay && addPaymentbutton()}
            </div>
          </div>
        </div>

        <NewReview />

        {rooms.reviews && rooms.reviews.length > 0 ? (
          <ListReviews reviews={rooms.reviews} />
        ) : (
          <p>
            <b>No Reviews on this room.</b>
          </p>
        )}

        {/* <div className="reviews w-75">
          <h3>Reviews:</h3>
          <hr />
          <div className="review-card my-3">
            <div className="rating-outer">
              <div className="rating-inner"></div>
            </div>
            <p className="review_user">by John</p>
            <p className="review_comment">Good Quality</p>

            <hr />
          </div>

          <div className="review-card my-3">
            <div className="rating-outer">
              <div className="rating-inner"></div>
            </div>
            <p className="review_user">by John</p>
            <p className="review_comment">Good Quality</p>

            <hr />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default RoomDetails;
