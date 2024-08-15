import { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service";
import { createReminder } from "../services/reminder.service";
import { ICreateEventDto } from "../types/dtos/event.dto";
import { IReminderDto } from "../types/dtos/reminder.dto";

export const createEvent = async (
	req: Request<{}, {}, ICreateEventDto, {}>,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	try {
		let { ...dto } = req.body;
		let images = req.files as Express.Multer.File[];
		dto.files = images.map((image) => image.path);

		const { files, ...body } = dto;

		body.organizer = req.user.id;

		const time = body.reminderTime;
		const reminderOwner = req.user.id;

		const newEvent = await eventService.createEvent(body, files);

		if (body.reminderTime) {
			const reminderDto: IReminderDto = {
				time,
				reminderOwner,
				event: newEvent.id,
			};

			await createReminder(reminderDto);
		}

		res.json({ message: "Event created", payload: newEvent });
	} catch (error) {
		next(error);
	}
};