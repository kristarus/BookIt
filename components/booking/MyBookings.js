import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { clearErrors } from "../../redux/actions/bookingActions";
import { MDBDataTable } from "mdbreact";
import easyinvoice from "easyinvoice";

const MyBookings = () => {
  const dispatch = useDispatch();

  const { bookings, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
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
                <Link href={`/bookings/${booking._id}`}>
                  <a className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                  </a>
                </Link>

                <button onClick={() => downloadInvoice(booking)} className="btn btn-success mx-2">
                  <i className="fa fa-download"></i>
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

    console.log(data);

    const result = await easyinvoice.createInvoice(data);
    easyinvoice.download(`invoice_${booking._id}`, result.pdf);
  };

  return (
    <div className="container container-fluid">
      <h1 className="my-5">My Bookings</h1>
      <MDBDataTable data={setBookings()} className="px-3" bordered striped hover />
    </div>
  );
};

export default MyBookings;
