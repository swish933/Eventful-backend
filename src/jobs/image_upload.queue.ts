import { Queue } from "bullmq";
import { IImageUploadDto } from "../types/job.types";
import { queueName } from "../util/constant";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const imageUploadQueue = new Queue(queueName.Images, {
	connection: {
		port: redisPort,
		host: redisHost,
	},
});

const enqueueUploadJob = function ({ data, opts }: IImageUploadDto) {
	console.log("Adding job to queue");
	console.log(data);
	imageUploadQueue.add("upload", data, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};

export { enqueueUploadJob };
