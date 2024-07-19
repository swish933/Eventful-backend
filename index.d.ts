import { UserRoles } from "./src/util/constant";

declare global {
	namespace Express {
		interface Request {
			user: {
				id?: string;
				sub: string;
				role: UserRoles;
				email: string;
			};
		}
	}
}
