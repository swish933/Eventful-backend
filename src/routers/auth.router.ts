import { NextFunction, Request, Response, Router } from "express";
import dotenv from "dotenv";
import validationMiddleware from "../middleware/validation.middleware";
import { passport } from "../middleware/auth.middleware";
import { registerUserSchema } from "../validation/auth.validation";
// import jwt from "jsonwebtoken";

// import * as authController from "../controllers/auth.controller";

dotenv.config();

const authRouter = Router();

authRouter.post(
	"/signup",
	validationMiddleware(registerUserSchema),
	passport.authenticate("signup", { session: false }),
	async (req: Request, res: Response, next: NextFunction) => {
		res.json({
			message: "Signup successful",
			user: req.user,
		});
	}
);

// authRouter.post("/login", async (req, res, next) => {
// 	passport.authenticate("login", async (err, user, info) => {
// 		try {
// 			if (err) {
// 				return next(err);
// 			}
// 			if (!user) {
// 				const error = new Error("Username or password is incorrect");
// 				return next(error);
// 			}

// 			req.login(user, { session: false }, async (error) => {
// 				if (error) return next(error);

// 				const body = { _id: user.id, email: user.email, role: user.role };
// 				//You store the id and email in the payload of the JWT.
// 				// You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
// 				// DO NOT STORE PASSWORDS IN THE JWT!
// 				const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

// 				return res.json({ token });
// 			});
// 		} catch (error) {
// 			return next(error);
// 		}
// 	})(req, res, next);
// });

// authRouter.post("/login", authController.loginUser);
// authRouter.post(
// 	"/signup",
// 	passport.authenticate("signup", { session: false }),
// 	authController.registerUser
// );

export default authRouter;
