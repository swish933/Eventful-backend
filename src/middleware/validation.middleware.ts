import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ICreateUserDto, ILoginUserDto } from "../types/dtos/user.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";

type validationSchemaUnion = ICreateUserDto | ILoginUserDto;

type requestContent = {
	body: object;
	file?: string;
};

const validationMiddleware = (schema: ObjectSchema) => {
	return async (
		req: Request<{}, {}, validationSchemaUnion, {}>,
		res: Response<IErrorResponse>,
		next: NextFunction
	) => {
		try {
			const content: requestContent = { body: req.body };

			if (req.file) {
				content.file = req.file.path;
			}

			await schema.validateAsync({ ...content });
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
