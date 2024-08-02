import { JobsOptions, Queue } from "bullmq";
import { IReminderJobDto } from "../../types/job.types";
import { queueName } from "../../util/constant";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const reminderQueue = new Queue(queueName.Reminders, {
	connection: {
		port: redisPort,
		host: redisHost,
	},
});

const queueOpts: JobsOptions = {
	removeOnComplete: true,
	removeOnFail: true,
	repeat: {
		pattern: "* * * * *",
	},
};

const enqueueReminderJob = async function (job: IReminderJobDto) {
	console.log("Adding reminder job to queue");
	reminderQueue.add(job.name, job.data, queueOpts);
};

export { enqueueReminderJob };
