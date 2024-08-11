import EventModel from "../database/models/events.schema";
import { IEvent } from "../database/models/events.schema";
import { ICreateEventDto } from "../types/dtos/event.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { enqueueUploadJob } from "../jobs/image_upload/image_upload.queue";
import { jobNames } from "../util/constant";
import { Types } from "mongoose";

export const createEvent = async (
	body: ICreateEventDto,
	files: string[]
): Promise<IEvent> => {
	try {
		const data = await EventModel.create(body);

		if (!data) {
			throw new ErrorWithStatus("An error occured. Please try again", 500);
		}

		enqueueUploadJob({
			name: jobNames.MultipleUpload,
			data: { images: files, eventId: data.id },
		});

		return data;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

export const getEventById = async (eventId: string): Promise<IEvent> => {
	try {
		const event = await EventModel.findById(eventId);
		if (!event) {
			throw new ErrorWithStatus("Event not found", 404);
		}
		return event;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

export const updateEvent = async (
	eventId: Types.ObjectId,
	customerId: Types.ObjectId
) => {
	try {
		const updatedEvent = await EventModel.findOneAndUpdate(
			{ _id: eventId },
			{ $push: { customers: customerId } }
		);

		if (!updatedEvent) {
			throw new ErrorWithStatus("Event not found", 404);
		}
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, error.status);
	}
};
