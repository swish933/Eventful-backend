// setting up my cloudinary account
import { ConfigOptions, v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const configOpt: ConfigOptions = {
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(configOpt);

export default cloudinary;
