import passport from "passport";
import {
	IStrategyOptionsWithRequest,
	IStrategyOptions,
	Strategy as LocalStrategy,
} from "passport-local";
import {
	Strategy as JWTstrategy,
	StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import UserModel from "../models/schemas/users.schema";
import { Request } from "express";
import { ICreateUserDto } from "../types/dtos/user.dto";

const loginErrorMsg = "Username/Email or Password is incorrect";
const loginSuccessMsg = "Logged in Successfully";

const logInStrategyOpts: IStrategyOptions = {
	usernameField: "user",
	passwordField: "password",
};

const signUpStartegyOpts: IStrategyOptionsWithRequest = {
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true,
};

const jwtStrategyOpts: StrategyOptionsWithoutRequest = {
	secretOrKey: process.env.JWT_SECRET ?? "secret",
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
	"signup",
	new LocalStrategy(
		signUpStartegyOpts,
		async (
			req: Request<{}, {}, ICreateUserDto, {}>,
			_email,
			_password,
			done
		) => {
			const dto = req.body;
			try {
				const newUser = await UserModel.create(dto);
				done(null, newUser);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	"login",
	new LocalStrategy(logInStrategyOpts, async (user, password, done) => {
		try {
			const existingUser = await UserModel.findOne({
				$or: [{ email: user }, { username: user }],
			});

			if (!existingUser) {
				return done(null, false, { message: loginErrorMsg });
			}

			const validate: boolean = await existingUser.isValidPassword(password);

			if (!validate) {
				return done(null, false, {
					message: loginErrorMsg,
				});
			}

			return done(null, existingUser, { message: loginSuccessMsg });
		} catch (error: any) {
			return done(error);
		}
	})
);

passport.use(
	new JWTstrategy(jwtStrategyOpts, async (decoded, done) => {
		try {
			return done(null, decoded);
		} catch (error) {
			done(error);
		}
	})
);

export { passport };
