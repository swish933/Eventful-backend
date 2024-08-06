import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ICreateUserDto, ILoginUserDto } from "../types/dtos/user.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { ICreateEventDto } from "../types/dtos/event.dto";

type validationSchemaUnion = ICreateUserDto | ILoginUserDto | ICreateEventDto;

type requestContent = {
	body: object;
	files?: string[];
	mimetypes?: string[];
};

const validationMiddleware = (schema: ObjectSchema) => {
	return async (
		req: Request<{}, {}, validationSchemaUnion, {}>,
		res: Response<IErrorResponse>,
		next: NextFunction
	) => {
		try {
			const content: requestContent = { body: req.body };

			console.log(req.file);

			if (req.file) {
				content.files = [];
				content.mimetypes = [];
				content.files?.push(req.file.path);
				content.mimetypes?.push(req.file.mimetype);
			}

			if (req.files) {
				const files = req.files as Express.Multer.File[];
				content.files = files.map((image: { path: string }) => image.path);
				content.mimetypes = files.map((image) => image.mimetype);
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
