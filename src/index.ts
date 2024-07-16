import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router";
import errorHandler from "./middleware/error.middleware";
import { connectToMongoDB } from "./models/connection";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

connectToMongoDB();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRouter);

//Catch all route
app.all("*", (req: Request, res: Response) => {
	res.status(404);
	res.json({
		message: "Not found",
	});
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
