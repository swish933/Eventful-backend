import { Request, Response, NextFunction } from "express";
import { IReminderDto } from "../types/dtos/reminder.dto";
import * as reminderService from "../services/reminder.service";
import { getEventById } from "../services/event.service";
import Joi, { DateSchema } from "joi";
import { Types } from "mongoose";

export async function createReminder(
	req: Request<{}, {}, IReminderDto, {}>,
	res: Response<IGenericResponse | IErrorResponse>,
	next: NextFunction
) {
	try {
		const { time, event } = req.body;
		const reminderOwner = req.user.id;

		const eventData = await getEventById(event);

		if (!eventData.customers?.includes(new Types.ObjectId(reminderOwner))) {
			return res.status(401).json({
				message: "Cannot create reminder for an event you haven't applied to",
				success: false,
			});
		}

		//check if reminder time is valid
		const reminderTimeSchema: DateSchema = Joi.date()
			.less(eventData.startsAt)
			.greater("now")
			.label("Reminder time");

		await reminderTimeSchema.validateAsync(time);

		const reminderDto: IReminderDto = { time, event, reminderOwner };

		const response = await reminderService.createReminder(reminderDto);

		return res
			.status(201)
			.json({ message: "Reminder created", payload: response });
	} catch (error) {
		if (error instanceof Joi.ValidationError) {
			return res.status(422).send({ message: error.message, success: false });
		}
		next(error);
	}
}
