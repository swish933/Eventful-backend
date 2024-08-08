import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/order.service";
import { getEventById } from "../services/event.service";
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
		const { eventId } = req.body;
		const customerId = req.user.id;

		const event = await getEventById(eventId);
		const amount = event.price;

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

		console.log(req.body);
		await orderService.updateOrder(id, event);
		console.log("Transaction found", body.data.reference);

		return res.status(200).json({
			message: "Callback received",
		});
	} catch (error: any) {
		next(error);
	}
}
