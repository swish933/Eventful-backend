import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import { IUser } from "../models/schemas/users.schema";

export const getUser = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	const { sub: dto } = req.user;
	try {
		const user: IUser | null = await userService.getUser(dto);
		return res.send({ message: "user details", payload: user });
	} catch (error) {
		next(error);
	}
};
