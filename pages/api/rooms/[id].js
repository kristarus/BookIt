import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { getSingleRoom, updateRoom, deleteRoom } from "../../../controllers/roomControllers";
import onError from "../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.get(getSingleRoom);
handler.use(isUserAuthenticated, authorizeRoles("admin")).put(updateRoom);
handler.use(isUserAuthenticated, authorizeRoles("admin")).delete(deleteRoom);

export default handler;
