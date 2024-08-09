export interface ICreateEventDto {
	name: string;
	description: string;
	price: number;
	location: string;
	startsAt: Date;
	endsAt: Date;
	eventType: string;
	reminderTime: Date;
	files?: string[];
	organizer?: string;
}
