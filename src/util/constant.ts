export const enum UserRoles {
	Creator = "creator",
	Eventee = "eventee",
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
	Images = "Images",
	Reminders = "Reminders",
}

export const enum jobNames {
	singleUpload = "singleUpload",
	multipleUpload = "multipleUpload",
	reminder = "reminder",
	reminderCleanUp = "reminderCleanUp",
}

export const mimetypes = /image\/png|image\/jpeg|image\/jpg|image\/webp/;
