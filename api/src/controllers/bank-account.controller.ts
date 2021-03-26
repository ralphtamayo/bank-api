import { Router, Request, Response } from 'express';
import { validateId } from '../middleware/validate-id';
import { CustomResponse } from '../utils/custom-response';
import { BankAccount } from '../models/bank-account.model';
import { fundTransferValidate } from '../validators/fund-transfer.validator';
import { FormUtils } from '../utils/form-utils';
import { FundTransfer } from '../models/fund-transfer.model';

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

/**
 * POST /api/bank-account/:id/fund-transfer
 */
router.get('/:id/fund-transfer', validateId, async (req: Request, res: Response) => {
	const fundTransfers = await FundTransfer.find({ $or: [{ from: req.params.id }, { to: req.params.id }]}).populate('from to', 'customer');

	res.status(200).send(fundTransfers);
});

/**
 * POST /api/bank-account/:id/fund-transfer
 */
router.post('/:id/fund-transfer', validateId, async (req: Request, res: Response) => {
	const bankAccount = await BankAccount.findById(req.params.id);

	if (bankAccount == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	const form = fundTransferValidate({
		from: bankAccount.id,
		fromBalance: bankAccount.balance,
		...req.body
	});

	if (form.error != null) {
		const errors = FormUtils.flattenErrors(form.error);

		return res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	const fundTransfer = new FundTransfer({ from: bankAccount.id, ...req.body });
	await fundTransfer.save(async _ => {
		let fromBankAccount = await BankAccount.findById(fundTransfer.from);
		let toBankAccount = await BankAccount.findById(fundTransfer.to);

		if (fromBankAccount == null || toBankAccount == null) {
			return res.status(400);
		}

		fromBankAccount.balance -= fundTransfer.amount;
		toBankAccount.balance += fundTransfer.amount;

		fromBankAccount.save();
		toBankAccount.save();
	});

	return res.status(200).send(fundTransfer);
});

export { router as bankAccountRouter }