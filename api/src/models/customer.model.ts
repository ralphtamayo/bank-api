import { Document, Schema, Model, model } from 'mongoose';

/**
 * Customer Interface
 */
export interface ICustomer extends Document {
	firstName: string;
	lastName: string;
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
		required: [true, 'Last name must not be blank.'],
		minLength: 2,
		maxLength: 50
	},
});

export const Customer: Model<ICustomer> = model('Customer', CustomerSchema);