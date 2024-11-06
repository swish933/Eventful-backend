import { Schema, model, Types, Model } from "mongoose";
import { orderStatus } from "../../util/constant";

export interface IOrder {
	id: string;
	amount: number;
	qrCode?: string;
	status: string;
	customer: Types.ObjectId;
	event: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export type OrderModel = Model<IOrder>;

const OrderSchema = new Schema<IOrder, OrderModel>(
	{
		amount: {
			type: Number,
			required: true,
		},
		qrCode: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: [orderStatus.Pending, orderStatus.Failed, orderStatus.Successful],
			default: orderStatus.Pending,
		},
		customer: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: "Event",
			required: true,
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
