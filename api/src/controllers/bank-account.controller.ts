import { Router, Request, Response } from 'express';
import { validateId } from '../middleware/validate-id';
import { Customer } from '../models/customer.model';
import { FormUtils } from '../utils/form-utils';
import { CustomResponse } from '../utils/custom-response';
import { BankAccount } from '../models/bank-account.model';

export const router = Router();

/**
 * GET /api/bank-account
 */
router.get('/', async (req: Request, res: Response) => {
	const bankAccounts = await BankAccount.find().select('balance customer');

	res.send(bankAccounts);
});

/**
 * GET /api/bank-account/:id
 */
router.get('/:id', validateId, async (req: Request, res: Response) => {
	const bankAccount = await BankAccount.findById(req.params.id).select('balance customer').populate('customer', 'firstName lastName');

	if (bankAccount == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	return res.status(200).send(bankAccount);
});

/**
 * GET /api/bank-account/:id/balance
 */
router.get('/:id/balance', validateId, async (req: Request, res: Response) => {
	const bankAccount = await BankAccount.findById(req.params.id).select('balance');

	if (bankAccount == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	return res.status(200).send(bankAccount);
});

export { router as bankAccountRouter }