import QRCode from "qrcode";
import { ErrorWithStatus } from "../exceptions/error-with-status";

export const generateQrCode = async (orderInfo: string): Promise<string> => {
	try {
		const qrcode = await QRCode.toDataURL(orderInfo);
		return qrcode;
	} catch (error) {
		throw new ErrorWithStatus("Internal Server Error", 500);
	}
};
