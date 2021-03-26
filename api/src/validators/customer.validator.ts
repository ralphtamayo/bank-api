import Joi from 'joi';
import { ICustomer } from '../models/customer.model';

export function customerValidate(customer: ICustomer) {
	const schema = Joi.object({
		firstName: Joi.string()
			.min(2)
			.max(50)
			.required(),
		lastName: Joi.string()
			.min(2)
			.max(50)
			.required(),
	});

	return schema.validate(customer, { abortEarly: false });
}
