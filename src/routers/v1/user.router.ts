import { Router } from "express";
import * as userController from "../../controllers/user.controller";
import { UserRoles } from "../../util/constant";
import {
	verifyRole,
	verifyToken,
} from "../../middleware/access-control.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import { registerUserSchema } from "../../validation/auth.validation";

const userRouter = Router();

userRouter.post(
	"/",
	validationMiddleware(registerUserSchema),
	userController.registerUser
);
userRouter.get(
	"/",
	verifyToken,
	verifyRole([UserRoles.Creator, UserRoles.Eventee]),
	userController.getUser
);

export default userRouter;
