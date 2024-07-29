import moogoose from "mongoose";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || "";

// connect to mongodb
function connectToMongoDB() {
	moogoose.connect(MONGODB_URI);

	moogoose.connection.on("connected", () => {
		console.log("Connected to MongoDB successfully");
	});

	moogoose.connection.on("error", (err) => {
		console.log("Error connecting to MongoDB", err);
	});

	mongoose.connection.on("disconnected", () =>
		console.log("disconnected from MongoDB")
	);
}

export { connectToMongoDB };
