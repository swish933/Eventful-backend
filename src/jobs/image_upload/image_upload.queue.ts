import { JobsOptions, Queue } from "bullmq";
import { IImageUploadJobDto } from "../../types/job.types";
import { queueName } from "../../util/constant";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(redisUrl);

const imageUploadQueue = new Queue(queueName.Images, { connection });

const queueOpts: JobsOptions = {
	removeOnComplete: true,
	removeOnFail: true,
};

const enqueueUploadJob = function (job: IImageUploadJobDto) {
	console.log("Adding image upload job to queue");
	imageUploadQueue.add(job.name, job.data, queueOpts);
};

imageUploadQueue.on("error", (err) => {
	console.log(err.message);
});
export { enqueueUploadJob };
