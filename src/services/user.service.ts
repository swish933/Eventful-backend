import { IUser } from "../models/schemas/users.schema";
import UserModel from "../models/schemas/users.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";

export const getUser = async (id: string): Promise<IUser | null> => {
	try {
		const data = await UserModel.findById(id);
		if (!data) {
			throw new ErrorWithStatus("User not found", 404);
		}
		return data;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};
