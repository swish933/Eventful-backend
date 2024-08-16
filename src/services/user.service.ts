import { IUser } from "../database/models/users.schema";
import UserModel from "../database/models/users.schema";
import { IEvent } from "../database/models/events.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { Types } from "mongoose";

export const getUser = async (id: string): Promise<IUser> => {
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

export const updateUserEvents = async (
	eventId: Types.ObjectId,
	customerId: Types.ObjectId
) => {
	const updatedUser = await UserModel.findOneAndUpdate(
		{ _id: customerId },
		{ $push: { events: eventId } }
	);

	if (!updatedUser) {
		throw new ErrorWithStatus("User not found", 404);
	}
	return;
};

export const getUserEvents = async (id: string) => {
	const events = await UserModel.findById(id).populate<{ events: IEvent[] }>({
		path: "events",
		select: "-customers -createdAt -updatedAt -images",
		populate: { path: "organizer", select: "avatar username" },
	});
	if (!events) {
		throw new ErrorWithStatus("Events not found", 404);
	}
	return events;
};
