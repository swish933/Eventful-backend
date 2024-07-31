export interface IImageUploadDto {
	data: {
		image?: string;
		images?: string[];
		userId?: string;
		eventId?: string;
	};
	opts?: {};
}
