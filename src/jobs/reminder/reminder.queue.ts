import { JobsOptions, Queue } from "bullmq";
import { IReminderJobDto } from "../../types/job.types";
import { queueName } from "../../util/constant";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(redisUrl);

const reminderQueue = new Queue(queueName.Reminders, { connection });

const reminderOpts: JobsOptions = {
	removeOnComplete: true,
	removeOnFail: true,
	repeat: {
		pattern: "* * * * *",
	},
};

const cleanUpOpts: JobsOptions = {
	removeOnComplete: true,
	removeOnFail: true,
	repeat: {
		pattern: "0 0 * * *",
	},
};

const enqueueReminderJob = async function (job: IReminderJobDto) {
	console.log(`Adding ${job.name} job to queue`);
	reminderQueue.add(job.name, job.data, job.opts);
};

reminderQueue.on("error", (err) => {
	console.log(err.message);
});

export { enqueueReminderJob, cleanUpOpts, reminderOpts };
