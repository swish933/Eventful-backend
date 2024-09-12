import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	},
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("connect", () => console.log("Redis Client Connected"));

export default client;
