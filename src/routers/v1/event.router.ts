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
import { limiter } from "../../util/ratelimiter";

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

eventRouter.get("/myevents", verifyToken, eventController.getEvents);

eventRouter.put("/qrcode/:orderId", eventController.admitAttendee);

eventRouter.get(
	"/",
	verifyToken,
	verifyRole([UserRoles.Attendee]),
	eventController.getAllEvents
);

eventRouter.get(
	"/analytics",
	verifyToken,
	verifyRole([UserRoles.Organizer]),
	eventController.getAllTimeAnalytics
);

eventRouter.get("/:eventId", verifyToken, eventController.getEventById);

eventRouter.get(
	"/analytics/:eventId",
	verifyToken,
	verifyRole([UserRoles.Organizer]),
	eventController.getEventAnalytics
);

export default eventRouter;
