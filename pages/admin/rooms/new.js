import React from "react";
import { getSession } from "next-auth/react";
import Layout from "../../../components/layout/Layout";
import NewRoom from "../../../components/admin/NewRoom";

const NewRoomPage = () => {
  return (
    <Layout title="New Room">
      <NewRoom />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default NewRoomPage;
