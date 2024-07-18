import moogoose from "mongoose";
import dotenv from "dotenv";

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
}

export { connectToMongoDB };
