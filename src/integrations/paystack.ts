import axios, { AxiosResponse } from "axios";
import {
	paystackResponseData,
	paystackTransactionData,
} from "../types/paystack.types";

const headers = {
	Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
};

const initializePaystackTransaction = async (
	data: paystackTransactionData
): Promise<AxiosResponse<paystackResponseData>> => {
	return await axios.post(
		`https://api.paystack.co/transaction/initialize`,
		data,
		{
			headers,
		}
	);
};

export { initializePaystackTransaction };
