import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { myBookings } from "../../../controllers/bookingControllers";
import onError from "../../../middlewares/errors";
import isUserAuthenticated from "../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated).get(myBookings);

export default handler;
