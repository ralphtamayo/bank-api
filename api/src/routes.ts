import { json } from 'express';
import { customerRouter } from './controllers/customer.controller';

export function initRoutes(app: any) {
	app.use(json());
	app.use('/api/customer', customerRouter);
	// app.use(errorHandler);
}