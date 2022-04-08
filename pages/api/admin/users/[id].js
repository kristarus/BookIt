import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import { getUsersDetails, updateUser, deleteUser } from "../../../../controllers/authControllers";
import onError from "../../../../middlewares/errors";
import isUserAuthenticated, { authorizeRoles } from "../../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isUserAuthenticated, authorizeRoles("admin")).get(getUsersDetails);

handler.use(isUserAuthenticated, authorizeRoles("admin")).put(updateUser);

handler.use(isUserAuthenticated, authorizeRoles("admin")).delete(deleteUser);

export default handler;
