export interface ICreateUserDto {
	email: string;
	username: string;
	password: string;
	phoneNumber: string;
	role?: string;
}

export interface ILoginUserDto {
	user: string;
	password: string;
}
