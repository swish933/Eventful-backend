import { Schema, model, Types, Model } from "mongoose";
import { EventType } from "../../util/constant";

export interface IEvent {
	name: string;
	images: string[];
	description: string;
	location: string;
	organizer: Types.ObjectId;
	startsAt: Date;
	endsAt: Date;
	eventType: string;
	customers?: Types.ObjectId[];
	orders?: Types.ObjectId[];
	reminder?: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

type EventModel = Model<IEvent>;

const EventSchema = new Schema<IEvent, EventModel>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		description: {
			type: String,
			trim: true,
			required: true,
		},
		location: {
			type: String,
			trim: true,
			required: true,
		},

		startsAt: {
			type: Date,
			required: true,
		},
		endsAt: {
			type: Date,
			required: true,
		},
		eventType: {
			type: String,
			enum: [EventType.Physical, EventType.Remote],
			required: true,
		},
		organizer: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		customers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		reminder: {
			type: Schema.Types.ObjectId,
			ref: "Reminder",
		},
	},
	{ timestamps: true }
);

EventSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_, ret) {
		delete ret._id;
		return ret;
	},
});

const Event = model<IEvent, EventModel>("Event", EventSchema);

export default Event;
