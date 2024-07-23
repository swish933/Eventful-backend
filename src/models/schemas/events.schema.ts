import { Schema, model, Types, Model } from "mongoose";
import { EventType } from "../../util/constant";

export interface IEvent {
	name: string;
	description: string;
	location: string;
	socialLinks: string[];
	startTime: Date;
	endTime: Date;
	eventType: string;
	customers: Types.ObjectId[];
	orders: Types.ObjectId[];
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
		socialLinks: {
			type: [String],
			trim: true,
			required: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		eventType: {
			type: String,
			enum: [EventType.Physical, EventType.Remote],
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
