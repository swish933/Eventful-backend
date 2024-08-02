import EventModel from "../database/models/events.schema";
import ReminderModel from "../database/models/reminder.schema";
import { IEvent } from "../database/models/events.schema";
import { ICreateEventDto } from "../types/dtos/event.dto";
import { IReminderDto } from "../types/dtos/reminder.dto";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { enqueueUploadJob } from "../jobs/image_upload/image_upload.queue";
import { jobNames } from "../util/constant";

export const createEvent = async (
	body: ICreateEventDto,
	files: string[],
	reminderDto: IReminderDto
): Promise<IEvent> => {
	try {
		const data = await EventModel.create(body);

		if (body.reminderTime) {
			reminderDto.event = data.id;
			await ReminderModel.create(reminderDto);
		}

		if (!data) {
			throw new ErrorWithStatus("An error occured. Please try again", 500);
		}

		enqueueUploadJob({
			name: jobNames.multipleUpload,
			data: { images: files, eventId: data.id },
		});

		return data;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};
