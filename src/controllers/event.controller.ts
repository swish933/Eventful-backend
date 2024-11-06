import { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service";
import { createReminder } from "../services/reminder.service";
import { ICreateEventDto } from "../types/dtos/event.dto";
import { IReminderDto } from "../types/dtos/reminder.dto";
import { UserRoles } from "../util/constant";
import { getUserEvents, updateUserEvents } from "../services/user.service";
import { Types } from "mongoose";
import { getOrderEvent } from "../services/order.service";

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

		await updateUserEvents(
			new Types.ObjectId(newEvent.id),
			new Types.ObjectId(req.user.id)
		);

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

//paginate and cache
export const getAllEvents = async (
	req: Request<{}, {}, {}, { page: string; limit: string }>,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20;

	const skip = (page - 1) * limit;

	try {
		const { events, meta } = await eventService.getAllEvents({
			page,
			limit,
			skip,
		});
		res.json({ message: "Events", payload: { events, meta } });
	} catch (error) {
		next(error);
	}
};

export const getEventById = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	try {
		const { eventId } = req.params;
		const event = await eventService.getEventById(eventId);
		res.json({ message: "Event", payload: event });
	} catch (error) {
		next(error);
	}
};

//paginate and cache
export const getEvents = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	try {
		if (req.user.role === UserRoles.Attendee) {
			const events = await getUserEvents(req.user.id);
			return res.json({ message: "events", payload: events });
		} else {
			const events = await eventService.getEvents(req.user.id);
			return res.json({ message: "events", payload: events });
		}
	} catch (error) {
		next(error);
	}
};

export async function admitAttendee(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { orderId } = req.params;
		const eventId = await getOrderEvent(orderId);
		await eventService.admitAttendee(eventId.toString());
		res.json({ message: "User successfully admitted" });
	} catch (error: any) {
		next(error);
	}
}

export const getAllTimeAnalytics = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	try {
		console.log(req.user.id);
		const analytics = await eventService.getAllTimeAnalytics(req.user.id);
		return res.json({ message: "analytics", payload: analytics });
	} catch (error) {
		next(error);
	}
};

export const getEventAnalytics = async (
	req: Request,
	res: Response<IGenericResponse>,
	next: NextFunction
) => {
	try {
		let { eventId } = req.params;
		const analytics = await eventService.getEventAnalytics(
			eventId,
			req.user.id
		);
		return res.json({ message: "analytics", payload: analytics });
	} catch (error) {
		next(error);
	}
};
