import { Job, Worker } from "bullmq";
import { IImageUploadJobDto } from "../../types/job.types";
import UserModel from "../../database/models/users.schema";
import EventModel from "../../database/models/events.schema";
import cloudinary from "../../integrations/cloudinary";
import fs from "node:fs/promises";
import { queueName, jobNames } from "../../util/constant";
import { connectToMongoDB } from "../../database/connection";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD;
const redisUserName = process.env.REDIS_USERNAME;

const uploadToCloudinary = async (job: Job) => {
	console.log("Uploading assets to cloudinary");

	const { image, images, userId, eventId } = job.data;

	const uploadSingleImage = async () => {
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
	};

	const uploadMultipleImages = async () => {
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
	};

	switch (job.name) {
		case jobNames.SingleUpload:
			uploadSingleImage();
			break;
		case jobNames.MultipleUpload:
			uploadMultipleImages();
			break;
		default:
			return;
	}
};

const worker = new Worker<IImageUploadJobDto>(
	queueName.Images,
	uploadToCloudinary,
	{
		connection: {
			host: redisHost,
			port: redisPort,
			username: redisUserName,
			password: redisPassword,
		},
	}
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});

connectToMongoDB();
console.log("Image Upload Worker started!");
