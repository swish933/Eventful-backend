import { IEvent } from "../database/models/events.schema";
import OrderModel, { IOrder } from "../database/models/orders.schema";
import { IUser } from "../database/models/users.schema";
import { ErrorWithStatus } from "../exceptions/error-with-status";
import { orderStatus } from "../util/constant";
import { generateQrCode } from "../util/generateQrCode";

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

		const qrcodeLink = `${process.env.CLIENT_BASE_URL}/qrcode/${orderId}`;

		if (event === "charge.success") {
			order.status = orderStatus.Successful;
			order.qrCode = await generateQrCode(qrcodeLink);
			await order.save();
		} else {
			order.status = orderStatus.Failed;
			await order.save();
		}
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}

export async function getOrder(orderId: string): Promise<IOrder> {
	try {
		const order = await OrderModel.findById(orderId);

		if (!order) {
			throw new ErrorWithStatus("Resource not found", 404);
		}

		return order;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}

export async function getPaymentInfo(orderId: string) {
	try {
		const order = await OrderModel.findOne({
			_id: orderId,
			status: orderStatus.Successful,
		})
			.populate<{ event: IEvent }>({
				path: "event",
				select: ["name", "location", "price"],
			})
			.populate<{ customer: IUser }>({
				path: "customer",
				select: "email",
			});

		if (!order) {
			throw new ErrorWithStatus("Resource not found", 404);
		}

		const admits = order.amount / order.event.price;

		const paymentInfo = {
			event: order.event.name,
			location: order.event.location,
			customer: order.customer.email,
			admits,
		};

		return paymentInfo;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
}
