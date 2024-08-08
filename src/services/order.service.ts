import OrderModel, { IOrder } from "../database/models/orders.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { orderStatus } from "../util/constant";

export async function newOrder(
	amount: number,
	customerId: string,
	eventId: string
): Promise<IOrder> {
	try {
		const newTransaction = OrderModel.create({
			amount,
			customer: customerId,
			event: eventId,
		});
		if (!newTransaction) {
			throw new ErrorWithStatus("An error occured", 500);
		}
		return newTransaction;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}

export async function updateOrder(orderId: string, event: string) {
	try {
		const order = await OrderModel.findOne({
			_id: orderId,
			status: orderStatus.Pending,
		});

		if (!order) {
			throw new ErrorWithStatus("Resource not found", 404);
		}

		if (event === "charge.success") {
			order.status = orderStatus.Successful;
			// //generate qr code and add to order
			// order.qrCode = generateQuickResponseCode()
			await order.save();
		} else {
			order.status = orderStatus.Failed;
			await order.save();
		}
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}
