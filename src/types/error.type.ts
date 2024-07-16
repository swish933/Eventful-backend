interface IErrorWithStatus extends Error {
	status: number;
}

interface IErrorResponse {
	message: string;
	success: boolean;
}
