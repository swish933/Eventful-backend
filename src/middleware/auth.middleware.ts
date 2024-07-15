import passport from "passport";
import {
	IStrategyOptionsWithRequest,
	Strategy as LocalStrategy,
} from "passport-local";
import {
	Strategy as JWTstrategy,
	StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import UserModel from "../models/schemas/users.schema";
import { Request } from "express";
import { ICreateUserDto } from "../dtos/CreateUserDto.dto";

// const jwtStrategyOpts: StrategyOptionsWithoutRequest = {
// 	secretOrKey: process.env.JWT_SECRET ?? "",
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };

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

const signUpStartegyOpt: IStrategyOptionsWithRequest = {
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true,
};

passport.use(
	"signup",
	new LocalStrategy(
		signUpStartegyOpt,
		async (req: Request<{}, {}, ICreateUserDto, {}>, email, password, done) => {
			const dto = req.body;
			try {
				const newUser = await UserModel.create(dto);
				return done(null, newUser);
			} catch (error) {
				done(error);
			}
		}
	)
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
	"login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({ email });

				if (!user) {
					return done(null, false, { message: "User not found" });
				}

				const validate: boolean = await (user as any).isValidPassword(password);

				if (!validate) {
					return done(null, false, { message: "Wrong Password" });
				}

				return done(null, user, { message: "Logged in Successfully" });
			} catch (error) {
				return done(error);
			}
		}
	)
);

export { passport };
