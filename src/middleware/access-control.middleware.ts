import { UserRoles } from "../util/constant";
import { NextFunction, Request, Response } from "express";
import { passport } from "../middleware/auth.middleware";
import { ErrorWithStatus } from "../exceptions/error-with-status";

const rbacErrorMsg =
	"You do not have the authorization and permissions to access this resource.";

export const verifyRole = (roles: UserRoles[]) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			next(new ErrorWithStatus(rbacErrorMsg, 403));
		}
		next();
	};
};

export const verifyToken = passport.authenticate("jwt", { session: false });
