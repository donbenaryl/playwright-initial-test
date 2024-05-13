import dotenv from "dotenv";
dotenv.config();

export const MANAGEMENT_BASE_URL = process.env.FE_MANAGEMENT_BASE_URL || "";
export const TEST_USER = process.env.TEST_USER || "";
export const TEST_PASSWORD = process.env.TEST_PASSWORD || "";
export const TEST_TEMPORARY_USER = "user.to.delete@askrella.de";
export const TEST_CUSTOMER_REFERRER: ICustomer = {
	address: "testAddress",
	city: "testCity",
	firstName: "ReferrerFN",
	lastName: "ReferrerLN",
	name: function (): string {
		return `${this.firstName} ${this.lastName}`;
	},
	contactName: "Jane Doe",
	country: "Germany",
	details: "testDetails",
	email: "referrer@askrella.de",
	iban: "testIban",
	phoneNumber: "098124758214",
	postalCode: "2600",
	referralCode: "",
	password: "P@ssw0rd123!"
};


export const TEST_CUSTOMER_REFERRED: ICustomer = {
    ...TEST_CUSTOMER_REFERRER,
	firstName: "ReferredFN",
	lastName: "ReferredLN",
	email: "referred@askrella.de",
	name: function (): string {
		return `${this.firstName} ${this.lastName}`;
	},
};

export const PLAN_DETAILS: IPlan = {
    name: "Plan Name",
    amount: 100,
    terahashes: 10,
    durationDays: 30,
}

export const FAKE_WALLET_ADDRESS = "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH";

interface ICustomer {
	name: () => string;
	firstName: string;
	lastName: string;
	email: string;
	details: string;
	iban: string;
	phoneNumber: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
	contactName: string;
	referralCode: string;
	password: string;
}

interface IPlan {
	name: string;
	amount: number;
	terahashes: number;
	durationDays: number;
}
