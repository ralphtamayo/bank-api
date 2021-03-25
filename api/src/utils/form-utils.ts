import { Error, Document } from 'mongoose';

export interface FormErrors { [key: string]: string }

export class FormUtils {
	static validateForm(entity: Document): FormErrors | null{
		const error = entity.validateSync();

		if (!(error instanceof Error.ValidationError)) {
			return null;
		}

		let errors = this.buildErrors(error);

		return errors;
	}

	static buildErrors(formError: Error.ValidationError): FormErrors {
		let errors: FormErrors = {};

		Object.keys(formError.errors).forEach((key) => {
			errors[key] = formError.errors[key].message;
		});

		return errors;
	}
}