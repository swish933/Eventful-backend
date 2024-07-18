import { Request, Response, NextFunction } from "express";

const errorHandler = (
	error: IErrorWithStatus,
	req: Request,
	res: Response<IErrorResponse>,
	next: NextFunction
) => {
	// console.error(error.message);
	res.status(error.status || 500);
	res.json({ message: error.message, success: false });
};

export default errorHandler;
