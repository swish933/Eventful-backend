import { Router } from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import { loginUserSchema } from "../../validation/auth.validation";
import * as authController from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
	"/login",
	validationMiddleware(loginUserSchema),
	authController.loginUser
);

export default authRouter;
