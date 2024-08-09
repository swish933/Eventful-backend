import Joi, { ObjectSchema } from "joi";
import { UserRoles, mimetypes } from "../util/constant";

const registerUserSchema: ObjectSchema = Joi.object({
	body: {
		email: Joi.string().email().required().label("Email"),
		username: Joi.string().required().label("Username"),
		password: Joi.string()
			.min(6)
			.required()
			.messages({ "string.min": "Password should be at least six characters" }),
		confirmPassword: Joi.string()
			.required()
			.valid(Joi.ref("password"))
			.label("Confirm password")
			.messages({ "any.only": "Passwords do not match" }),
		phoneNumber: Joi.string()
			.regex(/^\+[1-9]{1}[0-9]{10,14}$/)
			.required()
			.label("Phone number")
			.messages({ "string.pattern.base": "Enter a valid phone number" }),
		role: Joi.string()
			.valid(UserRoles.Organizer, UserRoles.Attendee)
			.required()
			.label("User role"),
		avatar: Joi.string(),
	},
	files: Joi.array().items(Joi.string().label("image")).label("Files"),

	mimetypes: Joi.array().items(Joi.string().pattern(mimetypes)),
});

const loginUserSchema: ObjectSchema = Joi.object({
	body: {
		user: Joi.string().required().label("Username or Email"),
		password: Joi.string()
			.min(6)
			.required()
			.label("Password")
			.messages({ "string.min": "Check that you entered the right password" }),
	},
});

export { registerUserSchema, loginUserSchema };
