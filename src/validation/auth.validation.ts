import Joi, { ObjectSchema } from "joi";

const registerUserSchema: ObjectSchema = Joi.object({
	email: Joi.string().email().required(),
	username: Joi.string().required(),
	password: Joi.string().min(6).required(),
	confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
	phoneNumber: Joi.string()
		.regex(/^\+[1-9]{1}[0-9]{10,14}$/)
		.required(),
	role: Joi.string(),
});

const loginUserSchema: ObjectSchema = Joi.object({
	email: Joi.string().email(),
	username: Joi.string(),
	password: Joi.string().min(6).required(),
}).xor("email", "userName");

export { registerUserSchema, loginUserSchema };
