import { Schema, model, Types, Model } from "mongoose";
import { resourceStatus } from "../../util/constant";

export interface IReminder {
	time: Date;
	status: string;
	creator: Types.ObjectId;
	event: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

type ReminderModel = Model<IReminder>;

const ReminderSchema = new Schema<IReminder, ReminderModel>(
	{
		time: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: [resourceStatus.Pending, resourceStatus.Completed],
			default: resourceStatus.Pending,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

ReminderSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_, ret) {
		delete ret._id;
		return ret;
	},
});

const Reminder = model<IReminder, ReminderModel>("Reminder", ReminderSchema);

export default Reminder;
