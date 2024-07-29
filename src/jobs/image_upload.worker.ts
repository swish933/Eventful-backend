import { Job, Worker } from "bullmq";
import { IImageUploadDto } from "../types/job.types";
import UserModel from "../models/schemas/users.schema";
import cloudinary from "../integrations/cloudinary";
import fs from "node:fs/promises";
import { queueName } from "../util/constant";
import { connectToMongoDB } from "../models/connection";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const uploadToCloudinary = async (job: Job) => {
	if (job.name === "upload") {
		try {
			const { imagePath, userId } = job.data;

			console.log("Uploading asset to cloudinary");

			// upload file to cloudinary
			const cloudinaryResponse = await cloudinary.uploader.upload(imagePath);

			//delete file from directory
			await fs.unlink(imagePath);

			const filter = { _id: userId };
			const update = { avatar: cloudinaryResponse.secure_url };

			const updatedUser = await UserModel.findOneAndUpdate(filter, update, {
				new: true,
			});

			console.log(updatedUser);
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
