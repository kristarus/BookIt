import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { clearErrors } from "../../redux/actions/bookingActions";
import { MDBDataTable } from "mdbreact";
import easyinvoice from "easyinvoice";
import Loader from "../layout/Loader";
import { getAdminRooms, deleteRoom } from "../../redux/actions/roomActions";
import { DELETE_ROOM_RESET } from "../../redux/constants/roomConstants";

const AllRooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, rooms } = useSelector((state) => state.allRooms);
  const { error: deleteError, isDeleted } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getAdminRooms());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      router.push("/admin/rooms");
      dispatch({ type: DELETE_ROOM_RESET });
    }
  }, [dispatch, deleteError, error, isDeleted]);

  const setRooms = () => {
    try {
      const data = {
        columns: [
          {
            label: "Room ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Name",
            field: "name",
            sort: "asc",
          },
          {
            label: "Price / Night",
            field: "price",
            sort: "asc",
          },
          {
            label: "Category",
            field: "categoty",
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

      rooms &&
        rooms.forEach((room) => {
          data.rows.push({
            id: room._id,
            name: room.name,
            price: `${room.pricePerNight}`,
            category: `${room.category}`,
            actions: (
              <>
                <Link href={`/admin/rooms/${room._id}`}>
                  <a className="btn btn-primary">
                    <i className="fa fa-pencil"></i>
                  </a>
                </Link>

                <button onClick={() => deleteRoomHandler(room._id)} className="btn btn-danger mx-2">
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

  const deleteRoomHandler = (id) => {
    dispatch(deleteRoom(id));
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">
            {`${rooms && rooms.length} Rooms`}
            <Link href="/admin/rooms/new">
              <a className="mt-0 btn text-white float-right new-room-btn">Create Room</a>
            </Link>
          </h1>
          <MDBDataTable data={setRooms()} className="px-3" bordered striped hover />
        </>
      )}
    </div>
  );
};

export default AllRooms;
