import { Schema, model, Types, Model } from "mongoose";
import { resourceStatus } from "../../util/constant";

export interface IOrder {
	orderAmount: number;
	qrCode?: string;
	status: string;
	customer: Types.ObjectId;
	event: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

type OrderModel = Model<IOrder>;

const OrderSchema = new Schema<IOrder, OrderModel>(
	{
		orderAmount: {
			type: Number,
			required: true,
		},
		qrCode: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: [resourceStatus.Pending, resourceStatus.Completed],
			default: resourceStatus.Pending,
		},
		customer: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: "Event",
		},
	},
	{ timestamps: true }
);

OrderSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_, ret) {
		delete ret._id;
		return ret;
	},
});

const Order = model<IOrder, OrderModel>("Order", OrderSchema);

export default Order;
