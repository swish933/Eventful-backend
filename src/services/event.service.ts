import EventModel, { IEvent } from "../database/models/events.schema";
import { IUser } from "../database/models/users.schema";
import { ICreateEventDto } from "../types/dtos/event.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { enqueueUploadJob } from "../jobs/image_upload/image_upload.queue";
import { jobNames } from "../util/constant";
import { Types } from "mongoose";

type Analytics = {
	attendees: number;
	tickets: number;
	scannedCodes: number;
};

export type EventsReturnType = {
	events: IEvent[];
	meta: { page: number; limit: number; total: number };
};

export const createEvent = async (
	body: ICreateEventDto,
	files: string[]
): Promise<IEvent> => {
	const data = await EventModel.create(body);

	if (!data) {
		throw new ErrorWithStatus("An error occured. Please try again", 500);
	}

	enqueueUploadJob({
		name: jobNames.MultipleUpload,
		data: { images: files, eventId: data.id },
	});

	return data;
};

export const getEventById = async (eventId: string) => {
	const event = await EventModel.findById(eventId).populate<{
		organizer: IUser;
	}>({
		path: "organizer",
		select: "username avatar",
	});
	if (!event) {
		throw new ErrorWithStatus("Event not found", 404);
	}

	return event;
};

export const getAllEvents = async ({
	page,
	limit,
	skip,
}: {
	page: number;
	limit: number;
	skip: number;
}): Promise<EventsReturnType> => {
	const events = await EventModel.find({ endsAt: { $gt: Date.now() } })
		.select("-customers -createdAt -updatedAt -admitted")
		.skip(skip)
		.limit(limit);

	if (!events) {
		throw new ErrorWithStatus("Events not found", 400);
	}
	const total = await EventModel.countDocuments({
		endsAt: { $gt: Date.now() },
	});

	return { events, meta: { page, limit, total } };
};

export const updateEventCustomers = async (
	eventId: Types.ObjectId,
	customerId: Types.ObjectId
) => {
	const updatedEvent = await EventModel.findOneAndUpdate(
		{ _id: eventId },
		{ $push: { customers: customerId } }
	);

	if (!updatedEvent) {
		throw new ErrorWithStatus("Event not found", 404);
	}
};

export const updateEventTickets = async (
	eventId: Types.ObjectId,
	amountPaid: number
) => {
	const event = await EventModel.findById(eventId);

	if (!event) {
		throw new ErrorWithStatus("Event not found", 404);
	}

	const ticketsSold = amountPaid / event.price;

	await EventModel.findByIdAndUpdate(eventId, {
		$inc: { ticketsSold: ticketsSold },
	});
};

export const getEvents = async (
	organizerId: string,
	{
		page,
		limit,
		skip,
	}: {
		page: number;
		limit: number;
		skip: number;
	}
) => {
	const events = await EventModel.find({ organizer: organizerId })
		.sort("-createdAt")
		.populate<{
			customers: IUser[];
		}>({
			path: "customers",
			select: "-role -createdAt -updatedAt -events -orders",
		})
		.skip(skip)
		.limit(limit);

	const total = await EventModel.countDocuments({ organizer: organizerId });

	if (!events) {
		throw new ErrorWithStatus("Events not found", 404);
	}
	return { events, meta: { page, limit, total } };
};

export const admitAttendee = async (eventId: string) => {
	const event = await EventModel.findByIdAndUpdate(eventId, {
		$inc: { admitted: 1 },
	});

	if (!event) {
		throw new ErrorWithStatus("Events not found", 404);
	}
};

export const getEventAnalytics = async (
	eventId: string,
	organizerId: string
): Promise<Analytics> => {
	const analytics: Analytics = {
		attendees: 0,
		tickets: 0,
		scannedCodes: 0,
	};

	const event = await EventModel.findOne({
		_id: eventId,
		organizer: organizerId,
	});

	if (!event) {
		throw new ErrorWithStatus("Event not found", 404);
	}

	analytics.attendees += event.customers.length;
	analytics.tickets += event.ticketsSold;
	analytics.scannedCodes += event.admitted;

	return analytics;
};

export const getAllTimeAnalytics = async (
	organizerId: string
): Promise<Analytics> => {
	const analytics: Analytics = {
		attendees: 0,
		tickets: 0,
		scannedCodes: 0,
	};

	const events = await EventModel.find({ organizer: organizerId });

	if (!events) {
		throw new ErrorWithStatus("Events not found", 404);
	}

	const initialValue = 0;

	const allTimeTickets = events.reduce(
		(accumulator, event) => accumulator + event.ticketsSold,
		initialValue
	);
	const allTimeAttendees = events.reduce(
		(accumulator, event) => accumulator + event.customers.length,
		initialValue
	);
	const allTimeAdmitted = events.reduce(
		(accumulator, event) => accumulator + event.admitted,
		initialValue
	);

	analytics.attendees += allTimeAttendees;
	analytics.tickets += allTimeTickets;
	analytics.scannedCodes += allTimeAdmitted;

	return analytics;
};
