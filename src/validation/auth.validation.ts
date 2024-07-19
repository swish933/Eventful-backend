import Joi, { ObjectSchema } from "joi";

const registerUserSchema: ObjectSchema = Joi.object({
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
	role: Joi.string(),
});

const loginUserSchema: ObjectSchema = Joi.object({
	user: Joi.string().required().label("Username or Email"),
	password: Joi.string()
		.min(6)
		.required()
		.messages({ "string.min": "Check that you entered the right password" }),
});

export { registerUserSchema, loginUserSchema };
