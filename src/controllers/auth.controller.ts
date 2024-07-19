import { NextFunction, Request, Response } from "express";
import { passport } from "../middleware/auth.middleware";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { IUser } from "../models/schemas/users.schema";
import jwt from "jsonwebtoken";
import { ICreateUserDto, ILoginUserDto } from "../types/dtos/user.dto";

const MONGODUPLICATEERRCODE: number = 11000;

const secret = process.env.JWT_SECRET ?? "secret";

const opts: jwt.SignOptions = {
	expiresIn: "1h",
};

export const registerUser = async (
	req: Request<{}, {}, ICreateUserDto, {}>,
	res: Response<IRegisterResponse>,
	next: NextFunction
) => {
	passport.authenticate(
		"signup",
		{ session: false },
		async (err: any, user: IUser) => {
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

			return res.status(201).json({
				message: "Registration successful",
				payload: user,
			});
		}
	)(req, res, next);
};

export const loginUser = (
	req: Request<{}, {}, ILoginUserDto, {}>,
	res: Response<ILoginResponse>,
	next: NextFunction
) => {
	passport.authenticate(
		"login",
		async (err: any, user: IUser, info: ICbInfo) => {
			try {
				if (err) {
					return next(err);
				}

				if (!user) {
					return next(new ErrorWithStatus(info.message, 400));
				}

				req.login(user, { session: false }, async (error) => {
					if (error) return next(error);

					const payload: IJwtPayload = {
						sub: user.id,
						email: user.email,
						role: user.role,
					};

					const token = jwt.sign(payload, secret, opts);

					return res.json({ token, message: info.message });
				});
			} catch (error) {
				return next(error);
			}
		}
	)(req, res, next);
};
