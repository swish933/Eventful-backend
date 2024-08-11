import { Router } from "express";
import { verifyToken } from "../../middleware/access-control.middleware";
import * as reminderController from "../../controllers/reminder.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { newReminderSchema } from "../../validation/reminder.validation";

const reminderRouter = Router();

reminderRouter.post(
	"/",
	verifyToken,
	validationMiddleware(newReminderSchema),
	reminderController.createReminder
);

export default reminderRouter;
