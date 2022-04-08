import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import {
  createRoomReview,
  getRoomReviwes,
  deleteReview,
} from "../../../controllers/roomControllers";
import isUserAuthenticated from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated).put(createRoomReview);

handler.use(isUserAuthenticated).get(getRoomReviwes);

handler.use(isUserAuthenticated).delete(deleteReview);

export default handler;
