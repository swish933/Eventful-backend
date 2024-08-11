import { IReminder } from "../database/models/reminder.schema";
import { IReminderDto } from "../types/dtos/reminder.dto";
import ReminderModel from "../database/models/reminder.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";

export async function createReminder(
	reminderDto: IReminderDto
): Promise<IReminder> {
	try {
		const newReminder = await ReminderModel.create(reminderDto);

		if (!newReminder) {
			throw new ErrorWithStatus("An error occured", 500);
		}

		return newReminder;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}
