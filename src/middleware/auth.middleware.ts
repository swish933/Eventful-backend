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
import { ICreateUserDto } from "../dtos/user.dto";

const jwtStrategyOpts: StrategyOptionsWithoutRequest = {
	secretOrKey: process.env.JWT_SECRET ?? "",
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// passport.use(
// 	new JWTstrategy(jwtStrategyOpts, async (token, done) => {
// 		try {
// 			return done(null, token.user);
// 		} catch (error) {
// 			done(error);
// 		}
// 	})
// );

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.

const signUpStartegyOpts: IStrategyOptionsWithRequest = {
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true,
};

passport.use(
	"signup",
	new LocalStrategy(
		signUpStartegyOpts,
		async (req: Request<{}, {}, ICreateUserDto, {}>, email, password, done) => {
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

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.

// const logInStrategyOpts: IStrategyOptions = {
// 	usernameField: "email",
// 	passwordField: "password",
// };

// passport.use(
// 	"login",
// 	new LocalStrategy(logInStrategyOpts, async (email, password, done) => {
// 		try {
// 			const existingUser = await UserModel.findOne({ email });

// 			if (!existingUser) {
// 				return done(null, false, { message: "User not found" });
// 			}

// 			const validate: boolean = await (existingUser as any).isValidPassword(
// 				password
// 			);

// 			if (!validate) {
// 				return done(null, false, { message: "Email or Password is incorrect" });
// 			}

// 			return done(null, existingUser, { message: "Logged in Successfully" });
// 		} catch (error) {
// 			return done(error);
// 		}
// 	})
// );

export { passport };
