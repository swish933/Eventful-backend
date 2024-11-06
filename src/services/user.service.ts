import { IUser } from "../database/models/users.schema";
import UserModel from "../database/models/users.schema";
import { IEvent } from "../database/models/events.schema";
import { IOrder } from "../database/models/orders.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { Types } from "mongoose";
import { EventsReturnType } from "./event.service";

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

export const updateUserOrders = async (
	orderId: string,
	customerId: Types.ObjectId
) => {
	const updatedUser = await UserModel.findOneAndUpdate(
		{ _id: customerId },
		{ $push: { orders: orderId } }
	);

	if (!updatedUser) {
		throw new ErrorWithStatus("User not found", 404);
	}
	return;
};

export const getUserEvents = async (
	id: string,
	{
		page,
		limit,
		skip,
	}: {
		page: number;
		limit: number;
		skip: number;
	}
): Promise<EventsReturnType> => {
	const user = await UserModel.findById(id).populate<{ events: IEvent[] }>({
		path: "events",
		select: "-customers -updatedAt -images",
		options: { skip, limit },
		populate: { path: "organizer", select: "avatar username" },
	});

	const currentUser = await UserModel.findById(id);
	const total = currentUser?.events?.length || 0;

	if (!user) {
		throw new ErrorWithStatus("Events not found", 404);
	}
	return { events: user.events, meta: { page, limit, total } };
};

export async function getUserOrdersById(
	userId: string,
	{ page, limit, skip }: { page: number; limit: number; skip: number }
) {
	const user = await UserModel.findById(userId).populate<{ orders: IOrder[] }>({
		path: "orders",
		options: { sort: "-createdAt", limit, skip },
		select: "-createdAt -updatedAt",
		populate: {
			path: "event",
			select: "name price startsAt location images eventType",
		},
	});

	const currentUser = await UserModel.findById(userId);
	const total = currentUser?.orders?.length || 0;

	if (!user) {
		throw new ErrorWithStatus("Events not found", 404);
	}
	return { orders: user.orders, meta: { page, limit, total } };
}
