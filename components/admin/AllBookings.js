import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { clearErrors, getAdminBookings, deleteBooking } from "../../redux/actions/bookingActions";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import easyinvoice from "easyinvoice";
import { DELETE_BOOKING_RESET } from "../../redux/constants/bookingConstants";
const AllBookings = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { bookings, error, loading } = useSelector((state) => state.bookings);
  const { isDeleted, error: deleteError } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getAdminBookings());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      router.push("/admin/bookings");
      dispatch({ type: DELETE_BOOKING_RESET });
    }
  }, [dispatch]);

  const setBookings = () => {
    try {
      const data = {
        columns: [
          {
            label: "Booking ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Check In",
            field: "checkIn",
            sort: "asc",
          },
          {
            label: "Check Out",
            field: "checkOut",
            sort: "asc",
          },
          {
            label: "Amount Paid",
            field: "amount",
            sort: "asc",
          },
          {
            label: "Actions",
            field: "actions",
            sort: "asc",
          },
        ],
        rows: [],
      };

      bookings &&
        bookings.forEach((booking) => {
          data.rows.push({
            id: booking._id,
            checkIn: new Date(booking.checkInDate).toLocaleString("en-US"),
            checkOut: new Date(booking.checkOutDate).toLocaleString("en-US"),
            amount: `$${booking.amountPaid}`,
            actions: (
              <>
                <Link href={`/admin/bookings/${booking._id}`}>
                  <a className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                  </a>
                </Link>

                <button onClick={() => downloadInvoice(booking)} className="btn btn-success mx-2">
                  <i className="fa fa-download"></i>
                </button>

                <button
                  onClick={() => deleteBookingHandler(booking._id)}
                  className="btn btn-danger mx-2"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </>
            ),
          });
        });
      return data;
    } catch (error) {
      console.log({ error });
    }
  };

  const downloadInvoice = async (booking) => {
    const data = {
      images: {
        // The logo on top of your invoice
        logo: "https://res.cloudinary.com/bookit/image/upload/v1617904918/bookit/bookit_logo_cbgjzv.png",
      },
      // Your own data
      sender: {
        company: "Book It",
        address: "Sample Street 123",
        zip: "10001",
        city: "Minsk",
        country: "Belarus",
      },
      // Your recipient
      client: {
        company: `${booking.user.name}`,
        address: `${booking.user.email}`,
        zip: "",
        city: `Check In: ${new Date(booking.checkInDate).toLocaleString("en-US")}`,
        country: `Check Out: ${new Date(booking.checkOutDate).toLocaleString("en-US")}`,
      },
      information: {
        // Invoice number
        number: `${booking._id}`,
        // Invoice data
        date: `${new Date(Date.now()).toLocaleString("en-US")}`,
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [
        {
          quantity: `${booking.daysOfStay}`,
          description: `${booking.room.name}`,
          "tax-rate": 0,
          price: `${booking.room.pricePerNight}`,
        },
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "This is auto generated invoice of your booking on Book It",
      // Settings to customize your invoice
      settings: {
        currency: "USD", // See documentation
        "tax-notation": "vat", // Defaults to
      },
      // Translate your invoice to your preferred language
      translate: {
        invoice: "Booking INVOICE",
      },
    };

    const result = await easyinvoice.createInvoice(data);
    easyinvoice.download(`invoice_${booking._id}`, result.pdf);
  };

  const deleteBookingHandler = (id) => {
    dispatch(deleteBooking(id));
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">{bookings && bookings.length} Bookings</h1>
          <MDBDataTable data={setBookings()} className="px-3" bordered striped hover />
        </>
      )}
    </div>
  );
};

export default AllBookings;
