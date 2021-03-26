import { TestUtils } from '../src/utils/test-utils';
import request from "supertest";
import { Customer } from '../src/models/customer.model';
import { BankAccount } from '../src/models/bank-account.model';
import { FundTransfer } from '../src/models/fund-transfer.model';

TestUtils.runServer();
let req = request(TestUtils.getApp());

const customer = { firstName: 'Ralph', lastName: 'Tamayo' };

beforeAll(async () => {
	// Create dummy data
	const bankAccountCustomer = await Customer.create(customer);
	const fromBankAccount = await BankAccount.create({ balance: 5000, customer: bankAccountCustomer.id });
	const toBankAccount = await BankAccount.create({ balance: 5000, customer: bankAccountCustomer.id });

	await FundTransfer.create({ from: fromBankAccount, to: toBankAccount, amount: 1000 });
});

afterAll(async () => {
	// Cleans up the customer and bank account collections.
	await Customer.deleteMany();
	await BankAccount.deleteMany();
	await FundTransfer.deleteMany();

	TestUtils.closeServer();
});

it("should list 1 bank account", async done => {
	let res = await req.get('/api/bank-account');

	expect(res.status).toBe(200);
	expect(res.body.length).toBe(2);

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

it("should get a bank account's fund transfers", async done => {
	const bankAccount = (await BankAccount.find())[0];

	expect(bankAccount).not.toBeNull();

	let res = await req.get(`/api/bank-account/${ bankAccount.id }/fund-transfer`);

	expect(res.status).toBe(200);
	expect(res.body.length).toBe(1);

	done();
});

it("should create a new fund transfer for a bank account", async done => {
	const [fromBankAccount, toBankAccount] = await BankAccount.find();

	expect(fromBankAccount).not.toBeNull();
	expect(toBankAccount).not.toBeNull();

	let res = await req.post(`/api/bank-account/${ fromBankAccount.id }/fund-transfer`).send({
		to: toBankAccount.id,
		amount: 1000
	});

	expect(res.status).toBe(200);

	done();
});