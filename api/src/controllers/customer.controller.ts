import { Router, Request, Response } from 'express';
import { validateId } from '../middleware/validate-id';
import { Customer } from '../models/customer.model';
import { FormUtils } from '../utils/form-utils';
import { CustomResponse } from '../utils/custom-response';
import { BankAccount } from '../models/bank-account.model';
import { customerValidate } from '../validators/customer.validator';
import { bankAccountValidate } from '../validators/bank-account.validator';

export const router = Router();

/**
 * GET /api/customer
 */
router.get('/', async (req: Request, res: Response) => {
	const customers = await Customer.find().select('firstName lastName');

	res.send(customers);
});

/**
 * POST /api/customer/new
 */
router.post('/new', async (req: Request, res: Response) => {
	const form = customerValidate(req.body);

	if (form.error != null) {
		const errors = FormUtils.flattenErrors(form.error);

		return res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	const customer = new Customer(req.body);

	await customer.save();

	return res.status(201).send(customer);
});

/**
 * GET /api/customer/:id
 */
router.get('/:id', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findById(req.params.id).select('firstName lastName').populate('bankAccounts');

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	return res.status(200).send(customer);
});

/**
 * PUT /api/customer/:id
 */
router.put('/:id', validateId, async (req: Request, res: Response) => {
	const form = customerValidate(req.body);

	if (form.error != null) {
		const errors = FormUtils.flattenErrors(form.error);

		return res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	res.status(200).send(customer);
});

/**
 * DELETE /api/customer/:id
 */
router.delete('/:id', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	res.send(customer);
});

/**
 * POST /api/customer/:id/bank-account/new
 */
router.post('/:id/bank-account/new', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findById(req.params.id);

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	const form = bankAccountValidate({ ...req.body, isNew: true });

	if (form.error != null) {
		const errors = FormUtils.flattenErrors(form.error);

		return res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	const bankAccount = new BankAccount({ customer: customer.id, balance: req.body.balance });
	await bankAccount.save().then(_ => {
		customer.bankAccounts.push(bankAccount);
		customer.save();
	});

	return res.status(201).send(bankAccount);
});

export { router as customerRouter }