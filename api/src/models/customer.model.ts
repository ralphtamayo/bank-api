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
		required: [true, 'First name must not be blank.'],
		minLength: [2, 'First name cannot be less than 2 characters.'],
		maxLength: [50, 'First name cannot be more than 50 characters.']
	},
	lastName: {
		type: String,
		required: [true, 'Last name must not be blank.'],
		minLength: [2, 'Last name cannot be less than 2 characters.'],
		maxLength: [50, 'Last name cannot be more than 50 characters.']
	}
});

export const Customer: Model<ICustomer> = model('Customer', CustomerSchema);