import { Job, Worker } from "bullmq";
import { IReminderJobDto } from "../../types/job.types";
import EventModel from "../../database/models/events.schema";
import ReminderModel from "../../database/models/reminder.schema";
import { queueName, jobNames } from "../../util/constant";
import { connectToMongoDB } from "../../database/connection";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const reminderSearch = async (job: Job) => {
	console.log(`Processing ${job.name} at ${new Date().toLocaleTimeString()}`);
};

const worker = new Worker<IReminderJobDto>(
	queueName.Reminders,
	reminderSearch,
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
