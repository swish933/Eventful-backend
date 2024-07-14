import { Schema, model } from "mongoose";
import { OrderStatus } from "../../util/constant";

const OrderSchema = new Schema(
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

const Order = model("Order", OrderSchema);

export default Order;
