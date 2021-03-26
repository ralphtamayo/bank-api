import request from "supertest";
import { BankAccount } from "../src/models/bank-account.model";
import { Customer } from '../src/models/customer.model';
import { TestUtils } from "../src/utils/test-utils";

TestUtils.runServer();
let req = request(TestUtils.getApp());

const customers = [
	{ firstName: 'Arisha', lastName: 'Barron' },
	{ firstName: 'Branden', lastName: 'Gibson' },
	{ firstName: 'Rhonda', lastName: 'Church' },
	{ firstName: 'Georgina', lastName: 'Hazel' },
];

const newCustomer = { firstName: 'Ralph', lastName: 'Tamayo' };
const updatedCustomer = { firstName: 'Ralph Mikel', lastName: 'Tamayo' };

const newBankAccount = { balance: 100 };

beforeAll(async () => {
	// Create dummy data
	await Customer.create(customers);
});

afterAll(async () => {
	// Cleans up the customer and bank account collections.
	await Customer.deleteMany();
	await BankAccount.deleteMany();

	TestUtils.closeServer();
});

it("should list 4 customers", async done => {
	let res = await req.get('/api/customer');

	expect(res.status).toBe(200);
	expect(res.body.length).toBe(4);

	done();
});

it("should create a new customer", async done => {
	const res = await req.post('/api/customer/new').send(newCustomer);

	expect(res.status).toBe(201);
	expect(res.body.firstName).toBe(newCustomer.firstName);
	expect(res.body.lastName).toBe(newCustomer.lastName);

	done();
});

it("should get a customer", async done => {
	const customer = await Customer.findOne(newCustomer);

	expect(customer).not.toBeNull();

	const res = await req.get(`/api/customer/${ customer!.id }`);

	expect(res.status).toBe(200);
	expect(res.body.firstName).toBe(newCustomer.firstName);
	expect(res.body.lastName).toBe(newCustomer.lastName);

	done();
});

it("should update a customer", async done => {
	const customer = await Customer.findOne(newCustomer);

	expect(customer).not.toBeNull();

	const res = await req.put(`/api/customer/${ customer!.id }`).send(updatedCustomer);

	expect(res.status).toBe(200);
	expect(res.body.firstName).toBe(updatedCustomer.firstName);
	expect(res.body.lastName).toBe(updatedCustomer.lastName);

	done();
});

it("should create a new bank account for a customer", async done => {
	const customer = await Customer.findOne({ firstName: updatedCustomer.firstName });

	let res = await req.post(`/api/customer/${ customer!.id }/bank-account/new`).send(newBankAccount);

	expect(res.status).toBe(201);
	expect(res.body.balance).toBe(newBankAccount.balance);

	done();
});

it("should delete a customer", async done => {
	const customer = await Customer.findOne({ firstName: updatedCustomer.firstName });

	expect(customer).not.toBeNull();

	await req.delete(`/api/customer/${ customer!.id }`).send();

	const deletedCustomer = await Customer.findOne({ firstName: updatedCustomer.firstName });

	expect(deletedCustomer).toBeNull();

	done();
});