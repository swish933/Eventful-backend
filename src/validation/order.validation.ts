import Joi, { ObjectSchema } from "joi";

const newOrderSchema: ObjectSchema = Joi.object({
	body: {
		eventId: Joi.string().required(),
	},
});

export { newOrderSchema };
