export interface ICreateUserDto {
	email: string;
	username: string;
	password: string;
	phoneNumber: string;
	role?: string;
}
