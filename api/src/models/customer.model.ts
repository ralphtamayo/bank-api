import { Document, Schema, Model, model } from 'mongoose';
import { IBankAccount } from './bank-account.model';

/**
 * Customer Interface
 */
export interface ICustomer extends Document {
	firstName: string;
	lastName: string;
	bankAccounts: Array<IBankAccount>;
}

/**
 * Customer Schema
 */
const CustomerSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 50
	},
	lastName: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 50
	},
	bankAccounts: [{
		type: Schema.Types.ObjectId,
		ref: "BankAccount"
	}]
});

export const Customer: Model<ICustomer> = model('Customer', CustomerSchema);