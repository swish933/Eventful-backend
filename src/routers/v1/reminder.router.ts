import { Router } from "express";
import { verifyToken } from "../../middleware/access-control.middleware";
import * as reminderController from "../../controllers/reminder.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { newReminderSchema } from "../../validation/reminder.validation";
import { limiter } from "../../util/ratelimiter";

const reminderRouter = Router();

reminderRouter.use(limiter);

reminderRouter.post(
	"/",
	verifyToken,
	validationMiddleware(newReminderSchema),
	reminderController.createReminder
);

export default reminderRouter;
