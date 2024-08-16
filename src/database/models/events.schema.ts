import { Schema, model, Types, Model } from "mongoose";
import { EventType } from "../../util/constant";

export interface IEvent {
	id: string;
	name: string;
	images: string[];
	description: string;
	price: number;
	location: string;
	organizer: Types.ObjectId;
	startsAt: Date;
	endsAt: Date;
	eventType: string;
	customers: Types.ObjectId[];
	ticketsSold: number;
	admitted: number;
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
		price: {
			type: Number,
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
		ticketsSold: {
			type: Number,
			default: 0,
		},
		admitted: {
			type: Number,
			default: 0,
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
