import { Router, Request, Response } from 'express';
import { validateId } from '../middleware/validate-id';
import { Customer } from '../models/customer.model';
import { FormUtils } from '../utils/form-utils';
import { CustomResponse } from '../utils/custom-response';

export const router = Router();

/**
 * TODO: Bank Accout GET endpoints.
 */

// /**
//  * GET /api/bank-account
//  */
// router.get('/', async (req: Request, res: Response) => {
// 	const bankAccounts = await Customer.find().select('firstName lastName');

// 	res.send(bankAccounts);
// });

// /**
//  * GET /api/bank-account/:id
//  */
// router.get('/:id', validateId, async (req: Request, res: Response) => {
// 	const bankAccount = await Customer.findById(req.params.id).select('firstName lastName');

// 	if (bankAccount == null) {
// 		return res.status(404).send(CustomResponse.createEntityNotFoundError());
// 	}

// 	return res.status(200).send(bankAccount);
// });

export { router as bankAccountRouter }