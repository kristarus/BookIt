import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { updateUserProfile } from "../../../controllers/authControllers";
import onError from "../../../middlewares/errors";
import isUserAuthenticated from "../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated).put(updateUserProfile);

export default handler;
