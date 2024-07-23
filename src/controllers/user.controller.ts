import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import { IUser } from "../models/schemas/users.schema";
import { ICreateUserDto } from "../types/dtos/user.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { passport } from "../middleware/auth.middleware";

const MONGODUPLICATEERRCODE: number = 11000;

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

export const getUser = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	const { id } = req.user;
	try {
		const user: IUser | null = await userService.getUser(id);
		return res.send({ message: "user details", payload: user });
	} catch (error) {
		next(error);
	}
};