import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { checkReviewAvailablity } from "../../../controllers/roomControllers";
import isUserAuthenticated from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated).get(checkReviewAvailablity);

export default handler;
