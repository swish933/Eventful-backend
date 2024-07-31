import Joi, { ObjectSchema } from "joi";
import { EventType, mimetypes } from "../util/constant";

const createEventSchema: ObjectSchema = Joi.object({
	body: {
		name: Joi.string().required().label("Event name"),
		description: Joi.string()
			.min(6)
			.required()
			.messages({ "string.min": "Add a longer description" }),
		location: Joi.string().required(),
		startsAt: Joi.date().greater("now").required().label("Event start-time"),
		endsAt: Joi.date()
			.greater(Joi.ref("startsAt"))
			.required()
			.label("Event end-time"),
		eventType: Joi.string()
			.valid(EventType.Physical, EventType.Remote)
			.required(),
		reminderTime: Joi.date()
			.less(Joi.ref("startsAt"))
			.greater("now")
			.label("Event reminder-time"),
	},

	files: Joi.array()
		.items(Joi.string().label("images").required())
		.label("Files"),

	mimetypes: Joi.array().items(Joi.string().required().pattern(mimetypes)),
});

export { createEventSchema };
