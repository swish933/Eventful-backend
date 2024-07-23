import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routers/v1/auth.router";
import userRouter from "./routers/v1/user.router";
import errorHandler from "./middleware/error.middleware";
import { connectToMongoDB } from "./models/connection";
import morgan from "morgan";
import eventRouter from "./routers/v1/event.router";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || "3000";

connectToMongoDB();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);

//Catch all route
app.all("*", (_req: Request, res: Response) => {
	res.status(404);
	res.json({
		message: "Not found",
	});
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
