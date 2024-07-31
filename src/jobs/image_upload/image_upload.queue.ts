import { Queue } from "bullmq";
import { IImageUploadDto } from "../../types/job.types";
import { jobNames, queueName } from "../../util/constant";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const imageUploadQueue = new Queue(queueName.Images, {
	connection: {
		port: redisPort,
		host: redisHost,
	},
});

const enqueueUploadJob = function ({ data, opts }: IImageUploadDto) {
	console.log("Adding image upload job to queue");
	imageUploadQueue.add(jobNames.singleUpload, data, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};

const enqueueMultipleUploadJob = function ({ data, opts }: IImageUploadDto) {
	console.log("Adding multiple image upload job to queue");
	imageUploadQueue.add(jobNames.multipleUpload, data, {
		removeOnComplete: true,
		removeOnFail: true,
	});
};

export { enqueueUploadJob, enqueueMultipleUploadJob };
