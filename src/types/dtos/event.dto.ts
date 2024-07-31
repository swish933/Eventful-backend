import { Types } from "mongoose";

export interface ICreateEventDto {
	name: string;
	description: string;
	location: string;
	startsAt: Date;
	endsAt: Date;
	eventType: string;
	reminderTime: Date;
	files?: string[];
	organizer?: string;
}

export interface IReminderDto {
	time: Date;
	creator: string;
	event?: string;
}
