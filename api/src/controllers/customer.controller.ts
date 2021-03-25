import { Router, Request, Response } from 'express';
import { validateId } from '../middleware/validate-id';
import { Customer } from '../models/customer.model';
import { FormUtils } from '../utils/form-utils';
import { CustomResponse } from '../utils/custom-response';

export const router = Router();

/**
 * GET /api/customers
 */
router.get('/', async (req: Request, res: Response) => {
	const customers = await Customer.find().select('firstName lastName');

	res.send(customers);
});

/**
 * POST /api/customers
 */
router.post('/new', async (req: Request, res: Response) => {
	const customer = new Customer(req.body);

	let errors = FormUtils.validateForm(customer);

	if (errors !== null) {
		res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	await customer.save();

	return res.status(201).send(customer);
});

/**
 * GET /api/customers/:id
 */
router.get('/:id', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findById(req.params.id).select('firstName lastName');

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	return res.status(200).send(customer);
});

/**
 * PUT /api/customers/:id
 */
router.put('/:id', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	let errors = FormUtils.validateForm(customer);

	if (errors !== null) {
		res.status(400).send(CustomResponse.createInvalidForm(errors));
	}

	res.status(200).send(customer);
});

/**
 * DELETE /api/customers/:id
 */
router.delete('/:id', validateId, async (req: Request, res: Response) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);

	if (customer == null) {
		return res.status(404).send(CustomResponse.createEntityNotFoundError());
	}

	res.send(customer);
});

export { router as customerRouter }