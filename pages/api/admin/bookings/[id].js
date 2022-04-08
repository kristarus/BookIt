import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import { deleteBooking } from "../../../../controllers/bookingControllers";
import onError from "../../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated, authorizeRoles("admin")).delete(deleteBooking);

export default handler;
