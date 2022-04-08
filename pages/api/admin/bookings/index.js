import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import { allAdminBookings } from "../../../../controllers/bookingControllers";
import onError from "../../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated, authorizeRoles("admin")).get(allAdminBookings);

export default handler;
