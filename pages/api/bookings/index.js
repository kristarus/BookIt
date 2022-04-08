import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { newBooking } from "../../../controllers/bookingControllers";
import onError from "../../../middlewares/errors";
import isUserAuthenticated from "../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated).post(newBooking);

export default handler;
