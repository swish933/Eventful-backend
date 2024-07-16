export class ErrorWithStatus extends Error implements IErrorWithStatus {
	status;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}
