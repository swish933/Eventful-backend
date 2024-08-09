export type paystackTransactionData = {
	amount: number;
	email: string;
	reference: string;
};

export type paystackResponseData = {
	authorization_url: string;
	access_code: string;
	reference: string;
};
