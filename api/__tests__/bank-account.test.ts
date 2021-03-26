import { TestUtils } from '../src/utils/test-utils';
import request from "supertest";
import { Customer } from '../src/models/customer.model';
import { BankAccount } from '../src/models/bank-account.model';

TestUtils.runServer();
let req = request(TestUtils.getApp());

const customer = { firstName: 'Ralph', lastName: 'Tamayo' };

beforeAll(async () => {
	// Create dummy data
	const bankAccountCustomer = await Customer.create(customer);
	await BankAccount.create({ balance: 5000, customer: bankAccountCustomer.id });
});

afterAll(async () => {
	// Cleans up the customer and bank account collections.
	await Customer.deleteMany();
	await BankAccount.deleteMany();

	TestUtils.closeServer();
});

it("should list 1 bank account", async done => {
	let res = await req.get('/api/bank-account');

	expect(res.status).toBe(200);
	expect(res.body.length).toBe(1);

	done();
});

it("should get a bank account", async done => {
	const bankAccount = (await BankAccount.find())[0];

	expect(bankAccount).not.toBeNull();

	let res = await req.get(`/api/bank-account/${ bankAccount.id }`);

	expect(res.status).toBe(200);
	expect(res.body.balance).toBe(5000);
	expect(res.body.customer.firstName).toBe(customer.firstName);
	expect(res.body.customer.lastName).toBe(customer.lastName);

	done();
});

it("should get a bank account's balance", async done => {
	const bankAccount = (await BankAccount.find())[0];

	expect(bankAccount).not.toBeNull();

	let res = await req.get(`/api/bank-account/${ bankAccount.id }/balance`);

	expect(res.status).toBe(200);
	expect(res.body.balance).toBe(5000);

	done();
});