import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({
	url: url,
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("connect", () => console.log(`Redis Client:${url} Connected`));

export default client;
