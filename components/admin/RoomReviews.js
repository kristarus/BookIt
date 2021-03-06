import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import { getRoomReviwes, deleteReview, clearErrors } from "../../redux/actions/roomActions";
import { DELETE_REVIEW_RESET } from "../../redux/constants/roomConstants";

const RoomReviews = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [roomId, setRoomId] = useState("");

  const { error, reviews } = useSelector((state) => state.roomReviews);
  const { error: deleteError, isDeleted } = useSelector((state) => state.review);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (roomId !== "") {
      dispatch(getRoomReviwes(roomId));
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Review is deleted");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, isDeleted, deleteError, roomId]);

  const setReviews = () => {
    try {
      const data = {
        columns: [
          {
            label: "Review ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Rating",
            field: "rating",
            sort: "asc",
          },
          {
            label: "Comment",
            field: "comment",
            sort: "asc",
          },
          {
            label: "User",
            field: "user",
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

      reviews &&
        reviews.forEach((review) => {
          data.rows.push({
            id: review._id,
            rating: review.rating,
            comment: `${review.comment}`,
            user: `${review.name}`,
            actions: (
              <>
                <button
                  onClick={() => deleteReviewHandler(review._id)}
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

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, roomId));
  };

  return (
    <div className="container container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-5">
          <div className="form-group">
            <label htmlFor="room_id_field">Enter Room Id</label>
            <input
              type="roomId"
              id="room_id_field"
              className="form-control"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
        </div>
      </div>
      {reviews && reviews.length > 0 ? (
        <MDBDataTable data={setReviews()} className="px-3" bordered striped hover />
      ) : (
        <div className="alert alert-danger mt-5 text-center">No Reviews</div>
      )}
    </div>
  );
};

export default RoomReviews;
