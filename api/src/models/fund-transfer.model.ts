import { Document, Schema, Model, model } from 'mongoose';

/**
 * Fund Transfer Interface
 */
export interface IFundTransfer extends Document {
	from: string;
	to: string;
	amount: number;
	dateTransferred: Date;
}

/**
 * Fund Transfer Schema
 */
const FundTransferSchema = new Schema({
	from: {
		type: Schema.Types.ObjectId,
		ref: 'BankAccount',
		required: true
	},
	to: {
		type: Schema.Types.ObjectId,
		ref: 'BankAccount',
		required: true
	},
	amount: {
		type: Number,
		required: true,
		min: 10
	},
	dateTransferred: {
		type: Date,
		default: new Date(),
	}
});

export const FundTransfer: Model<IFundTransfer> = model('FundTransfer', FundTransferSchema);