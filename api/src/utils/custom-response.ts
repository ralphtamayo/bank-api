import { FormErrors } from "./form-utils";

export class CustomResponse {
	static createInvalidForm(errors: FormErrors)
	{
		return this.createError(400, 'invalid-form', { data: errors });
	}

	static createEntityNotFoundError()
	{
		return this.createError(404, 'entity-not-found');
	}

	static createError(status: number, message: string, extras: Object = {}) {
		return {
			error: {
				code: status,
				message: message,
				...extras 
			}
		}
	}
}