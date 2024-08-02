interface IJobs {
	name: string;
	data?: {};
	opts?: {};
}

export interface IImageUploadJobDto extends IJobs {
	data: {
		image?: string;
		images?: string[];
		userId?: string;
		eventId?: string;
	};
}

export interface IReminderJobDto extends IJobs {}
