import { JobsOptions, Queue } from "bullmq";
import { IImageUploadJobDto } from "../../types/job.types";
import { queueName } from "../../util/constant";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD;
const redisUserName = process.env.REDIS_USERNAME;

const imageUploadQueue = new Queue(queueName.Images, {
	connection: {
		host: redisHost,
		port: redisPort,
		username: redisUserName,
		password: redisPassword,
	},
});
const queueOpts: JobsOptions = {
	removeOnComplete: true,
	removeOnFail: true,
};

const enqueueUploadJob = function (job: IImageUploadJobDto) {
	console.log("Adding image upload job to queue");
	imageUploadQueue.add(job.name, job.data, queueOpts);
};

export { enqueueUploadJob };
