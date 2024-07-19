import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { UserRoles } from "../util/constant";
import {
	verifyRole,
	verifyToken,
} from "../middleware/access-control.middleware";

const userRouter = Router();

userRouter.get(
	"/",
	verifyToken,
	verifyRole([UserRoles.Creator, UserRoles.Eventee]),
	userController.getUser
);

export default userRouter;
