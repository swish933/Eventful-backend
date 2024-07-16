import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ICreateUserDto, ILoginUserDto } from "../dtos/user.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";

type validationSchemaUnion = ICreateUserDto | ILoginUserDto;

const validationMiddleware = (schema: ObjectSchema) => {
	return async (
		req: Request<{}, {}, validationSchemaUnion, {}>,
		res: Response<IErrorResponse>,
		next: NextFunction
	) => {
		try {
			await schema.validateAsync(req.body);
			next();
		} catch (error: unknown) {
			if (error instanceof Joi.ValidationError) {
				return res.status(422).send({ message: error.message, success: false });
			}
			throw new ErrorWithStatus("Server Error", 500);
		}
	};
};

export default validationMiddleware;
