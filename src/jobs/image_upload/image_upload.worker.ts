import { Job, Worker } from "bullmq";
import { IImageUploadDto } from "../../types/job.types";
import UserModel from "../../models/schemas/users.schema";
import EventModel from "../../models/schemas/events.schema";
import cloudinary from "../../integrations/cloudinary";
import fs from "node:fs/promises";
import { queueName, jobNames } from "../../util/constant";
import { connectToMongoDB } from "../../models/connection";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const uploadToCloudinary = async (job: Job) => {
	console.log("Uploading assets to cloudinary");

	const { image, images, userId, eventId } = job.data;

	if (job.name === jobNames.singleUpload) {
		try {
			const filter = { _id: userId };

			// upload file to cloudinary
			const cloudinaryResponse = await cloudinary.uploader.upload(image);

			//delete file from directory
			await fs.unlink(image);

			const update = { avatar: cloudinaryResponse.secure_url };

			await UserModel.findOneAndUpdate(filter, update, {
				new: true,
			});
		} catch (error) {
			console.error(error);
		}
	}

	if (job.name === jobNames.multipleUpload) {
		try {
			const filter = { _id: eventId };

			// upload files to cloudinary
			const imagesToUpload = images.map(async (image: string) => {
				const result = await cloudinary.uploader.upload(image);
				return result;
			});

			const uploads = await Promise.all(imagesToUpload);
			const cloudinaryUploadUrls: string[] = uploads.map(
				(upload) => upload.secure_url
			);

			//delete files from directory
			images.forEach(async (image: string) => {
				await fs.unlink(image);
			});

			const update = { images: [...cloudinaryUploadUrls] };

			await EventModel.findOneAndUpdate(filter, update, {
				new: true,
			});
		} catch (error) {
			console.error(error);
		}
	}
};

const worker = new Worker<IImageUploadDto>(
	queueName.Images,
	uploadToCloudinary,
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
console.log("Worker started!");
