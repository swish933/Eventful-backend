import { Schema, model, Model } from "mongoose";
import { OrderStatus } from "../../util/constant";

export interface IOrder {
	orderAmount: number;
	qrCode: string;
	orderNumber: string;
	status: string;
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
		orderNumber: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: [OrderStatus.Pending, OrderStatus.Completed],
			default: OrderStatus.Pending,
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
