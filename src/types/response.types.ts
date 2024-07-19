interface IRegisterResponse {
	message: string;
	payload: Express.User | undefined;
}

interface ILoginResponse {
	token: string;
	message: string;
}

interface IGenericResponse {
	message: string;
	payload: any;
}
