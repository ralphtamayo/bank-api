import { json } from 'express';
import { bankAccountRouter } from './controllers/bank-account.controller';
import { customerRouter } from './controllers/customer.controller';

export function initRoutes(app: any) {
	app.use(json());
	app.use('/api/customer', customerRouter);
	app.use('/api/bank-account', bankAccountRouter);
}