import Joi from 'joi';
import { IFundTransfer } from '../models/fund-transfer.model';

export function fundTransferValidate(fundTransfer: IFundTransfer) {
	const schema = Joi.object({
		from: Joi.string()
			.required(),
		to: Joi.string()
			.required()
			.disallow(Joi.ref('from'))
			.messages({
				'any.invalid': '\"to\" bank account cannot be the same as the from bank account.',
			}),
		fromBalance: Joi.number()
			.required(),
		amount: Joi.number()
			.required()
			.positive()
			.min(10)
			.max(Joi.ref('fromBalance'))
			.messages({
				'number.max': '\"amount\" cannot be greater than the bank account\'s balance.'
			})
	});

	return schema.validate(fundTransfer, { abortEarly: false });
}
