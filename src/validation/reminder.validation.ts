import Joi, { ObjectSchema } from "joi";

const newReminderSchema: ObjectSchema = Joi.object({
	body: {
		event: Joi.string().required(),
		time: Joi.date().greater("now").label("Event reminder-time").required(),
	},
});

export { newReminderSchema };
