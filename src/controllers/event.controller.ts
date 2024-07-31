import { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service";
import { ICreateEventDto, IReminderDto } from "../types/dtos/event.dto";

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
		const creator = req.user.id;

		const reminderDto: IReminderDto = { time, creator };

		const newEvent = await eventService.createEvent(body, files, reminderDto);

		res.json({ message: "Event created", payload: newEvent });
	} catch (error) {
		next(error);
	}
};
