import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import {
	loginUserSchema,
	registerUserSchema,
} from "../validation/auth.validation";
import * as authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
	"/signup",
	validationMiddleware(registerUserSchema),
	authController.registerUser
);

authRouter.post(
	"/login",
	validationMiddleware(loginUserSchema),
	authController.loginUser
);

export default authRouter;
