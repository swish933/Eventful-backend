import { IEvent } from "../models/schemas/events.schema";
import { ICreateEventDto, IReminderDto } from "../types/dtos/event.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import EventModel from "../models/schemas/events.schema";
import ReminderModel from "../models/schemas/reminder.schema";
import { enqueueMultipleUploadJob } from "../jobs/image_upload/image_upload.queue";

export const createEvent = async (
	body: ICreateEventDto,
	files: string[],
	reminderDto: IReminderDto
): Promise<IEvent> => {
	try {
		const data = await EventModel.create(body);
		reminderDto.event = data.id;
		await ReminderModel.create(reminderDto);

		if (!data) {
			throw new ErrorWithStatus("An error occured. Please try again", 500);
		}

		enqueueMultipleUploadJob({ data: { images: files, eventId: data.id } });

		return data;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};
