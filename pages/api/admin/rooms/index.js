import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import { allAdminRooms } from "../../../../controllers/roomControllers";
import onError from "../../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated, authorizeRoles("admin")).get(allAdminRooms);

export default handler;
