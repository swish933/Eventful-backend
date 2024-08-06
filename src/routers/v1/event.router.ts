import { Request, Router } from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import { createEventSchema } from "../../validation/event.validation";
import * as eventController from "../../controllers/event.controller";
import multer from "multer";
import { UserRoles } from "../../util/constant";
import {
	verifyRole,
	verifyToken,
} from "../../middleware/access-control.middleware";

const eventRouter = Router();

const upload = multer({
	dest: "/tmp/uploads",
	limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

eventRouter.post(
	"/",
	verifyToken,
	verifyRole([UserRoles.Organizer]),
	upload.array("images", 5),
	validationMiddleware(createEventSchema),
	eventController.createEvent
);

export default eventRouter;
