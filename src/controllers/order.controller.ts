import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/order.service";
import {
	getEventById,
	updateEventCustomers,
	updateEventTickets,
} from "../services/event.service";
import {
	updateUserEvents,
	updateUserOrders,
	getUserOrdersById,
} from "../services/user.service";
import { IOrderDto } from "../types/dtos/order.dto";
import { AxiosResponse } from "axios";
import { initializePaystackTransaction } from "../integrations/paystack";
import {
	paystackTransactionData,
	paystackResponseData,
} from "../types/paystack.types";

export async function initiateTransaction(
	req: Request<{}, {}, IOrderDto, {}>,
	res: Response<IGenericResponse>,
	next: NextFunction
) {
	try {
		const { eventId, tickets } = req.body;
		const customerId = req.user.id;

		const event = await getEventById(eventId);
		const amount = event.price * tickets;

		const transaction = await orderService.newOrder(
			amount,
			customerId,
			eventId
		);

		const data: paystackTransactionData = {
			amount: amount * 100,
			email: req.user.email,
			reference: transaction.id,
		};

		console.log(data);

		const response: AxiosResponse<paystackResponseData> =
			await initializePaystackTransaction(data);

		return res.json({ message: "Authorization URL", payload: response.data });
	} catch (error) {
		next(error);
	}
}

export async function verifyOrder(_req: Request, res: Response) {
	return res.json({
		message: "Transaction successful",
	});
}

export async function updateOrder(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const body = req.body;
		const event = body.event;
		const id = body.data.reference;

		const updatedOrder = await orderService.updateOrder(id, event);
		const customerId = updatedOrder.customer;
		const eventId = updatedOrder.event;
		const amountPaid = updatedOrder.amount;

		await updateEventCustomers(eventId, customerId);
		await updateEventTickets(eventId, amountPaid);
		await updateUserEvents(eventId, customerId);
		await updateUserOrders(updatedOrder.id, customerId);

		console.log("Transaction, Event and User updated", body.data.reference);

		return res.status(200).json({
			message: "Callback received",
		});
	} catch (error: any) {
		next(error);
	}
}

export async function getOrder(
	req: Request<{ orderId: string }>,
	res: Response<IGenericResponse>,
	next: NextFunction
) {
	try {
		const { orderId } = req.params;
		const order = await orderService.getOrder(orderId, req.user.id);
		res.json({ message: "Order", payload: order });
	} catch (error: any) {
		next(error);
	}
}

export async function getPaymentInfo(
	req: Request<{ orderId: string }>,
	res: Response<IGenericResponse>,
	next: NextFunction
) {
	try {
		const { orderId } = req.params;
		const paymentInformation = await orderService.getPaymentInfo(orderId);
		res.json({ message: "Order", payload: paymentInformation });
	} catch (error: any) {
		next(error);
	}
}

export async function getUserOrders(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const orders = await getUserOrdersById(req.user.id);
		res.json({ message: "Orders", payload: orders });
	} catch (error: any) {
		next(error);
	}
}
