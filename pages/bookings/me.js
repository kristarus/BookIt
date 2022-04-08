import React from "react";
import { getSession } from "next-auth/react";
import Layout from "../../components/layout/Layout";
import { wrapper } from "../../redux/store";
import { myBookings } from "../../redux/actions/bookingActions";
import MyBookings from "../../components/booking/MyBookings";

const MyBookingsPage = () => {
  return (
    <Layout title="My Bookings">
      <MyBookings />
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  await store.dispatch(myBookings(req.headers.cookie, req));
});

export default MyBookingsPage;
