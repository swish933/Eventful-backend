import { Router } from "express";
import * as userController from "../../controllers/user.controller";
import { UserRoles } from "../../util/constant";
import {
	verifyRole,
	verifyToken,
} from "../../middleware/access-control.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import { registerUserSchema } from "../../validation/auth.validation";
import multer from "multer";

const userRouter = Router();
const upload = multer({ dest: "/tmp/uploads" });

userRouter.post(
	"/",
	upload.single("avatar"),
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
