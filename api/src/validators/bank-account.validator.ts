import Joi from 'joi';
import { IBankAccount } from '../models/bank-account.model';

export function bankAccountValidate(bankAccount: IBankAccount) {
	const schema = Joi.object({
		isNew: Joi.boolean()
			.required(),
		balance: Joi.number()
			.required()
			.when('isNew', { is: true, then: Joi.number().positive()})
			.concat(Joi.number().when('isNew', { is: false, then: Joi.number().min(0)}))
	});

	return schema.validate(bankAccount, { abortEarly: false });
}
