export const enum UserRoles {
	Organizer = "organizer",
	Attendee = "attendee",
}

export const enum EventType {
	Remote = "remote",
	Physical = "physical",
}

export const enum resourceStatus {
	Pending = "pending",
	Completed = "completed",
}

export const enum queueName {
	Images = "images",
	Reminders = "reminders",
}

export const enum jobNames {
	SingleUpload = "singleUpload",
	MultipleUpload = "multipleUpload",
	Reminder = "reminder",
	ReminderCleanUp = "reminderCleanUp",
}

export const mimetypes = /image\/png|image\/jpeg|image\/jpg|image\/webp/;
