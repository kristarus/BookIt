import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { allRooms, newRoom } from "../../../controllers/roomControllers";
import onError from "../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.get(allRooms);
handler.use(isUserAuthenticated, authorizeRoles("admin")).post(newRoom);

export default handler;
