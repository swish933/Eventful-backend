import { Schema, model } from "mongoose";
import { EventType } from "../../util/constant";

const EventSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		location: {
			type: String,
			trim: true,
			default: null,
		},
		shareLink: {
			type: String,
			trim: true,
			required: true,
		},
		remoteEventLink: {
			type: String,
			trim: true,
			default: null,
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

const Event = model("Event", EventSchema);

export default Event;
