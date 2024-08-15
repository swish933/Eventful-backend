import Mailgun, { MailgunMessageData } from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});

const domain = process.env.MAILGUN_DOMAIN || "domainhere";

async function sendEmail(info: MailgunMessageData) {
	try {
		const response = await mg.messages.create(domain, info);
		console.log(response);
	} catch (error) {
		console.error(error);
	}
}

export { sendEmail };
