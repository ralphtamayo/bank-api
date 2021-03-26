import { Document, Schema, Model, model } from 'mongoose';

/**
 * Bank Account Interface
 */
export interface IBankAccount extends Document {
	balance: number;
	customer: string;
}

/**
 * Bank Account Schema
 */
const BankAccountSchema = new Schema({
	balance: {
		type: Number,
		default: 0,
		min: 0
	},
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'Customer',
		required: true
	}
});

export const BankAccount: Model<IBankAccount> = model('BankAccount', BankAccountSchema);