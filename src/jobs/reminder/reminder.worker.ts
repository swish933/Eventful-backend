import { Job, Worker } from "bullmq";
import { IReminderJobDto } from "../../types/job.types";
import ReminderModel, {
	IReminder,
} from "../../database/models/reminder.schema";
import { queueName, jobNames, UserRoles } from "../../util/constant";
import { connectToMongoDB } from "../../database/connection";
import { ErrorWithStatus } from "../../exceptions/error-with-status";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const findDueReminders = async (): Promise<IReminder[]> => {
	try {
		const filter = { time: Date.now() };
		const reminders = await ReminderModel.find(filter).populate([
			"event",
			"reminderOwner",
		]);
		if (!reminders) {
			throw new ErrorWithStatus("No reminders currently", 404);
		}

		return reminders;
	} catch (error: any) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

const sendDueReminderNotifs = async () => {
	const dueReminders = await findDueReminders();

	dueReminders.forEach((reminder) => {
		// if (reminder.reminderOwner.role === UserRoles.Creator) {
		/**  send mail to all users in that reminder's event customers/orders array.
			     ==> reminder.event.customers (reminder.event.populate().customers[]) 
			 */
		// emailService();
		// } else {
		/**send email to reminder.reminderOwner.email */
		// }
	});
};

const cleanUpReminders = async () => {
	//remove all reminders with a status of complete
};

const processReminderJob = async (job: Job) => {
	console.log(`Processing ${job.name} at ${new Date().toLocaleTimeString()}`);
	switch (job.name) {
		case jobNames.Reminder:
			sendDueReminderNotifs();
			break;
		case jobNames.ReminderCleanUp:
			cleanUpReminders();
			break;
		default:
			return;
	}
};

const worker = new Worker<IReminderJobDto>(
	queueName.Reminders,
	processReminderJob,
	{
		connection: { port: redisPort, host: redisHost },
	}
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});

connectToMongoDB();
console.log("Reminder Worker started!");
