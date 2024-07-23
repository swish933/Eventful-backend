import Joi, { ObjectSchema } from "joi";

const createEventSchema: ObjectSchema = Joi.object({
	name: Joi.string().required().label("Event name"),
	description: Joi.string()
		.min(6)
		.required()
		.messages({ "string.min": "Add a longer description" }),
	location: Joi.string().required(),
	startTime: Joi.date().required(),
	endTime: Joi.date().required(),
	eventType: Joi.string().required(),
});

export { createEventSchema };
