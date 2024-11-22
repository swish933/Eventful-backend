import { connectToMongoDB } from "../../database/connection";
import { Job, Worker } from "bullmq";
import { queueName, jobNames, UserRoles } from "../../util/constant";
import { ErrorWithStatus } from "../../exceptions/error-with-status";
import { IReminderJobDto } from "../../types/job.types";
import { IEvent } from "../../database/models/events.schema";
import { IUser } from "../../database/models/users.schema";
import ReminderModel from "../../database/models/reminder.schema";
import User from "../../database/models/users.schema";
import Event from "../../database/models/events.schema";
import {
	enqueueReminderJob,
	cleanUpOpts,
	reminderOpts,
} from "../reminder/reminder.queue";
import { resourceStatus } from "../../util/constant";
import { sendEmail } from "../../integrations/mailgun";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
// const redisHost = process.env.REDIS_HOST || "127.0.0.1";
// const redisPort = Number(process.env.REDIS_PORT) || 6379;

const connection = new IORedis(redisUrl, {
	maxRetriesPerRequest: null,
});

const sendReminderNotifs = async () => {
	try {
		const timeNow = Date.now();
		const filter = {
			time: { $lte: timeNow },
			status: resourceStatus.Pending,
		};

		const reminders = await ReminderModel.find(filter)
			.populate<{ reminderOwner: IUser }>({
				path: "reminderOwner",
				select: "email username role",
				model: User,
			})
			.populate<{ event: IEvent }>({
				path: "event",
				select: "name location startsAt customers",
				model: Event,
				populate: {
					path: "customers",
					select: "email -_id",
					model: User,
					transform: (doc: IUser) => (doc == null ? null : doc.email),
				},
			})
			.select("-createdAt -updatedAt");

		if (!reminders.length) {
			console.log("No reminders right now");
			return;
		}

		for (const reminder of reminders) {
			if (reminder.reminderOwner.role === UserRoles.Attendee) {
				sendEmail({
					from: "Eventful",
					to: reminder.reminderOwner.email,
					subject: `[${reminder.event.name}] reminder`,
					template: "eventftul_event_reminder",
					"t:variables": JSON.stringify({
						title: reminder.event.name,
						dateTime: reminder.event.startsAt.toString(),
					}),
				});
			}

			if (
				reminder.reminderOwner.role === UserRoles.Organizer &&
				reminder.event.customers.length
			) {
				sendEmail({
					from: "Eventful",
					to: reminder.event.customers.toString(),
					subject: `[${reminder.event.name}] reminder`,
					template: "eventftul_event_reminder",
					"t:variables": JSON.stringify({
						title: reminder.event.name,
						dateTime: reminder.event.startsAt.toString(),
					}),
				});
			}

			reminder.status = resourceStatus.Completed;
			await reminder.save();
		}
	} catch (error: any) {
		console.error(error);
		throw new ErrorWithStatus(error.message, 500);
	}
};

const cleanUpReminders = async () => {
	//remove all reminders with a status of complete
	try {
		// const filter = {status}
		await ReminderModel.deleteMany({ status: resourceStatus.Completed });
		console.log("Deleted completed reminders");
	} catch (error: any) {
		console.error(error);
		throw new ErrorWithStatus(error.message, 500);
	}
};

const processReminderJob = async (job: Job) => {
	console.log(`Processing ${job.name} at ${new Date().toLocaleTimeString()}`);
	switch (job.name) {
		case jobNames.Reminder:
			await sendReminderNotifs();
			break;
		case jobNames.ReminderCleanUp:
			await cleanUpReminders();
			break;
		default:
			return;
	}
};

const worker = new Worker<IReminderJobDto>(
	queueName.Reminders,
	processReminderJob,
	{ connection }
);

worker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`${job?.id} has failed with ${err.message}`);
});

worker.on("error", (err) => {
	console.log(err.message);
});

connectToMongoDB();

(async () => {
	await enqueueReminderJob({
		name: jobNames.Reminder,
		opts: reminderOpts,
	});
})();

(async () => {
	await enqueueReminderJob({
		name: jobNames.ReminderCleanUp,
		opts: cleanUpOpts,
	});
})();

console.log("Reminder Worker started!");
