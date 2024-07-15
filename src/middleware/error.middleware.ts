import { Express, Request, Response, NextFunction } from "express";

const errorHandler = (
	error: ErrorWithStatus,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(error);
	res.status(error.status || 500);
	res.json({ error: error.message, success: false });
};

export default errorHandler;
