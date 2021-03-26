import { ValidationError } from 'joi';

export interface FormErrors { [key: string]: string }

export class FormUtils {
	static flattenErrors(formErrors: ValidationError ) {
		const errors: { [property: string]: string } = {};

		formErrors.details.forEach(error => {
			errors[error.path[0]] = error.message;
		});

		return errors;
	}
}