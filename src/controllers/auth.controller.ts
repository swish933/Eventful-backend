import { NextFunction, Request, Response } from "express";
import { passport } from "../middleware/auth.middleware";
import { ErrorWithStatus } from "../exceptions/error-with-status";

export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	type RequestUserType = false | Express.User | undefined;
	const MONGODUPLICATEERRCODE: number = 11000;

	interface IRegisterResponse {
		message: string;
		payload: Express.User | undefined;
	}

	passport.authenticate(
		"signup",
		{ session: false },
		async (err: any, user: RequestUserType) => {
			// console.log(err);
			if (err && err.code === MONGODUPLICATEERRCODE) {
				return next(
					new ErrorWithStatus(
						`A user with this ${Object.keys(err.keyPattern)[0]} already exists`,
						400
					)
				);
			}
			if (err) {
				return next(new ErrorWithStatus("Registration failed, try again", 400));
			}
			req.user = user;
			return res.status(201).json({
				message: "Registration successful",
				payload: req.user,
			});
		}
	)(req, res, next);
};
export const loginUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {};
