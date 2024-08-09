import { NextFunction, Request, Response } from "express";
import { passport } from "../middleware/auth.middleware";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { IUser } from "../database/models/users.schema";
import jwt from "jsonwebtoken";
import { ILoginUserDto } from "../types/dtos/user.dto";

const secret = process.env.JWT_SECRET ?? "secret";

const opts: jwt.SignOptions = {
	expiresIn: "1h",
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
						id: user.id,
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
