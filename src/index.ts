import express, { Request, Response } from "express";
import dotenv from "dotenv";
// import usersRouter from "./routers/users.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use("/api/users", usersRouter);

app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
