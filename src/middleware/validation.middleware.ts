import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ICreateUserDto } from "../dtos/CreateUserDto.dto";

type validationSchemaUnion = ICreateUserDto;

const validationMiddleware = (schema: ObjectSchema) => {
	return async (
		req: Request<{}, {}, validationSchemaUnion, {}>,
		res: Response,
		next: NextFunction
	) => {
		try {
			await schema.validateAsync(req.body);
			next();
		} catch (error: unknown) {
			if (error instanceof Joi.ValidationError) {
				return res.status(422).send({ message: error.message, success: false });
			}
		}
	};
};

export default validationMiddleware;
