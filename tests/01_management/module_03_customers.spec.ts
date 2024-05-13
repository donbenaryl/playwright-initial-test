import { test, expect } from "@playwright/test";
import {
	MANAGEMENT_BASE_URL,
	TEST_CUSTOMER_REFERRED,
	TEST_CUSTOMER_REFERRER,
	TEST_PASSWORD,
	TEST_TEMPORARY_USER,
	TEST_USER
} from "../constants";

test.describe("Customers page", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");

		await page.goto(MANAGEMENT_BASE_URL + "/customers");
	});

	test.describe("customers page", () => {
		test("should redirect to login page when unauthenticated", async ({ page }) => {
			await page.click('button >> text="Logout"');

			await page.goto(MANAGEMENT_BASE_URL + "/customers");

			await expect(page.url()).toBe(MANAGEMENT_BASE_URL + "/login");
		});

		test("customer page has heading title", async ({ page }) => {
			await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
			await expect(page.locator('p >> text="A list of all our Customers."')).toBeVisible();
		});

		test("customer page shows list of customers", async ({ page }) => {
			await expect(page.locator('th >> text="Name"')).toBeVisible();
			await expect(page.locator('th >> text="Contact"')).toBeVisible();
			await expect(page.locator('th >> text="Active"')).toBeVisible();
			await expect(page.locator('th >> text="Referred By"')).toBeVisible();
		});
	});

	test.describe("customer creation", () => {
		test.beforeEach(async ({ page }) => {
			await page.getByRole("button", { name: "Create Customer" }).click();

			await page.waitForSelector('h3:has-text("Create Customer")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Form title
			await expect(page.locator(`h3 >> text="Create Customer"`)).toBeVisible();
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to create your new Customer"`)
			).toBeVisible();
			// Form labels
			await expect(page.locator(`label >> text="Customer Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="Email"`)).toBeVisible();
			await expect(page.locator(`label >> text="Details"`)).toBeVisible();
			await expect(page.locator(`label >> text="IBAN"`)).toBeVisible();
			await expect(page.locator(`label >> text="Phone Number"`)).toBeVisible();
			await expect(page.locator(`label >> text="Address"`)).toBeVisible();
			await expect(page.locator(`label >> text="City"`)).toBeVisible();
			await expect(page.locator(`label >> text="Postal Code"`)).toBeVisible();
			await expect(page.locator(`label >> text="Country"`)).toBeVisible();
			await expect(page.locator(`label >> text="Contact Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="Referral Code"`)).toBeVisible();
		});

		test("email required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("name required", async ({ page }) => {
			// await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("details required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("iban required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("phone required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("address required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("city required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("zip required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("contact required", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.selectOption('select[name="country"]', TEST_CUSTOMER_REFERRER.country);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("should succeed with default country set to Germany and no referral code", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await expect(page.locator('select[name="country"]')).toHaveValue("Germany");

			await page.click('button >> text="Create"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Create Customer")', { state: "hidden" });

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRER.name()}")`, { state: "visible" });
		});

		test("should fail on invalid referral code", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRED.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRED.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRED.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRED.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRED.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRED.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRED.postalCode);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRED.contactName);
			await page.fill('input[name="referral_code"]', "invalidCode");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Invalid referral code"')).toBeVisible();
		});

		test("should succeed on valid referral code", async ({ page }) => {
			// Fetch referral code
			await page.goto(MANAGEMENT_BASE_URL + "/users");
			const referralCode = await page.textContent(
				`tr:has-text("${TEST_CUSTOMER_REFERRER.email}") > td:nth-child(4)`
			);

			await expect(referralCode).not.toBe("");

			// Go back to customers page
			await page.goto(MANAGEMENT_BASE_URL + "/customers");

			await page.getByRole("button", { name: "Create Customer" }).click();

			await page.waitForSelector('h3:has-text("Create Customer")', { state: "visible" });

			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRED.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRED.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRED.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRED.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRED.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRED.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRED.postalCode);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRED.contactName);
			await page.fill('input[name="referral_code"]', referralCode || "invalidCode");

			await page.click('button >> text="Create"');

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRED.contactName}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRER.name()}")`, { state: "visible" });
		});

		test("should fail when creating existing customer email", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRER.name());
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRER.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRER.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRER.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRER.contactName);

			await expect(page.locator('select[name="country"]')).toHaveValue("Germany");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Email already taken"')).toBeVisible();
		});

		test("create user to delete", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.name() + "temporary");
			await page.fill('input[name="email"]', TEST_TEMPORARY_USER);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRED.details);
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRED.iban);
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRED.phoneNumber);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRED.address);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRED.city);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRED.postalCode);
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRED.contactName);

			await expect(page.locator('select[name="country"]')).toHaveValue("Germany");

			await page.click('button >> text="Create"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "hidden" });

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary")`, {
				state: "visible"
			});
		});
	});

	test.describe("customer update", () => {
		test.beforeEach(async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const updateBtn = await newUser?.$('button:has-text("Details")');
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to update your Customer"`)
			).toBeVisible();
			// Form labels
			await page.waitForSelector(`div:has-text("Active")`, { state: "visible" });
			await expect(page.locator(`label >> text="Customer Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="Email"`)).toBeVisible();
			await expect(page.locator(`label >> text="Details"`)).toBeVisible();
			await expect(page.locator(`label >> text="IBAN"`)).toBeVisible();
			await expect(page.locator(`label >> text="Phone Number"`)).toBeVisible();
			await expect(page.locator(`label >> text="Address"`)).toBeVisible();
			await expect(page.locator(`label >> text="City"`)).toBeVisible();
			await expect(page.locator(`label >> text="Postal Code"`)).toBeVisible();
			await expect(page.locator(`label >> text="Country"`)).toBeVisible();
			await expect(page.locator(`label >> text="Contact Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="Referral Code"`)).toBeVisible();
		});

		test("email required", async ({ page }) => {
			await page.fill('input[name="email"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("name required", async ({ page }) => {
			await page.fill('input[name="name"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("details required", async ({ page }) => {
			await page.fill('textarea[name="details"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("iban required", async ({ page }) => {
			await page.fill('input[name="iban"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("phone required", async ({ page }) => {
			await page.fill('input[name="phone"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("address required", async ({ page }) => {
			await page.fill('input[name="address"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("city required", async ({ page }) => {
			await page.fill('input[name="city"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("zip required", async ({ page }) => {
			await page.fill('input[name="zip"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("contact required", async ({ page }) => {
			await page.fill('input[name="contact"]', "");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("should fail on invalid referral code", async ({ page }) => {
			await page.fill('input[name="referral_code"]', "invalidCode");

			await page.click('button >> text="Update"');

			await expect(page.locator('p >> text="Invalid referral code"')).toBeVisible();
		});

		test("should succeed on valid form", async ({ page }) => {
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.name() + "temporaryUpdated");
			await page.fill('input[name="email"]', "temporary" + TEST_TEMPORARY_USER);
			await page.fill('textarea[name="details"]', TEST_CUSTOMER_REFERRED.details + "temporary");
			await page.fill('input[name="iban"]', TEST_CUSTOMER_REFERRED.iban + "temporary");
			await page.fill('input[name="phone"]', TEST_CUSTOMER_REFERRED.phoneNumber + "temporary");
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRED.address + "temporary");
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRED.city + "temporary");
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRED.postalCode + "temporary");
			await page.fill('input[name="contact"]', TEST_CUSTOMER_REFERRED.contactName + "temporary");
			await page.selectOption('select[name="country"]', "Albania");

			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "hidden" });

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporaryUpdated")`, {
				state: "visible"
			});

			// Validate customer updated
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporaryUpdated")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const updateBtn = await newUser?.$('button:has-text("Details")');
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "visible" });

			// Validate form details
			await expect(page.locator("input[name='name']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.name() + "temporaryUpdated"
			);
			await expect(page.locator("input[name='email']")).toHaveValue("temporary" + TEST_TEMPORARY_USER);
			await expect(page.locator("textarea[name='details']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.details + "temporary"
			);
			await expect(page.locator("input[name='iban']")).toHaveValue(TEST_CUSTOMER_REFERRED.iban + "temporary");
			await expect(page.locator("input[name='phone']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.phoneNumber + "temporary"
			);
			await expect(page.locator("input[name='address']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.address + "temporary"
			);
			await expect(page.locator("input[name='city']")).toHaveValue(TEST_CUSTOMER_REFERRED.city + "temporary");
			await expect(page.locator("input[name='zip']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.postalCode + "temporary"
			);
			await expect(page.locator("input[name='contact']")).toHaveValue(
				TEST_CUSTOMER_REFERRED.contactName + "temporary"
			);
			await expect(page.locator("select[name='country']")).toHaveValue("Albania");
		});

		test("should succeed on valid referral code", async ({ page }) => {
			// Fetch referral code
			await page.goto(MANAGEMENT_BASE_URL + "/users");
			let referralCode = await page.textContent(
				`tr:has-text("${TEST_CUSTOMER_REFERRED.email}") > td:nth-child(4)`
			);
			referralCode = referralCode || "invalidCode";

			await expect(referralCode).not.toBe("");

			// Use referral code
			await page.goto(MANAGEMENT_BASE_URL + "/customers");
			let selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporaryUpdated")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const updateBtn = await newUser?.$('button:has-text("Details")');
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "visible" });

			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.name() + "temporary");
			await page.fill('input[name="referral_code"]', referralCode);

			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "hidden" });

			// Validate referrer
			await page.waitForSelector(
				`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary") > td:has-text("${TEST_CUSTOMER_REFERRED.name()}")`
			);

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary")`, {
				state: "visible"
			});

			selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary")`;

			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "visible" });

			// Validate referral code in form
			await expect(page.locator("input[name='referral_code']")).toHaveValue(referralCode);
		});

		test("should succeed on deactivating customer", async ({ page }) => {
			await page.click("#active_switch");
			// Click update user button
			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "hidden" });

			// Validate table shows customer as inactive
			await page.waitForSelector(
				`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary") > td > div > svg.inactive-icon`
			);
		});

		test("should succeed on activating customer", async ({ page }) => {
			await page.click("#active_switch");
			// Click update customer button
			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update Customer")', { state: "hidden" });

			// Validate table shows customer as inactive
			await page.waitForSelector(
				`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary") > td > div > svg.active-icon`
			);
		});
	});

	test.describe("customer deletion", () => {
		test("delete customer", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}temporary")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Delete Customer ${TEST_CUSTOMER_REFERRED.name()}temporary")`, {
				state: "visible"
			});
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRED.name()}temporary"`);
			expect(tdElement).toHaveCount(0);
		});
	});

	test.describe("assign user to customer", () => {
		test.beforeEach(async ({ page }) => {
			const selector =
				await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}") > td > span:has-text("Assign Customer")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			await page.click(selector)

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Assign Customer")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Validate customers list hint
			await page.waitForSelector('p:has-text("User(s) assigned to customer")', { state: "visible" });

			// Validate table headers
			await page.waitForSelector('th:has-text("Name")', { state: "visible" });
			await page.waitForSelector('th:has-text("Email")', { state: "visible" });

			// Validate assign customer hint
			await expect(page.locator('p >> text="Please assign the user to a customer"')).toBeVisible();

			// Validate unassigned users label
			await expect(page.locator('label >> text="Unassigned Users"')).toBeVisible();
		});

		test("should have default option", async ({ page }) => {
			await expect(page.locator("#user_id")).toHaveValue("");
		});

		test("assign referred user", async ({ page }) => {
			const referrerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRED.email}"`)
				.getAttribute("value");

			await page.selectOption('select[name="user_id"]', referrerId);

			await page.click('button >> text="Assign"');

			// Validate user assigned shown in table
			// Show assign modal again
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const assignBtn = await newUser?.$('button:has-text("Assign Customer")');
			await assignBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Assign Customer")', { state: "visible" });

			// Scan Assigned users table
			await expect(
				page.locator(`#assigned_users >> td >> text="${TEST_CUSTOMER_REFERRED.name()}"`)
			).toBeVisible();
			await expect(page.locator(`#assigned_users >> td >> text="${TEST_CUSTOMER_REFERRED.email}"`)).toBeVisible();
		});
	});

	test.describe("assign customer to user", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/users");

			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.email}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const assignBtn = await newUser?.$('button:has-text("Assign User")');
			await assignBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Assign User")', { state: "visible" });
		});

		test("assign referrer customer", async ({ page }) => {
			const referrerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRER.name()}"`)
				.getAttribute("value");

			await page.selectOption('select[name="customer_id"]', referrerId);

			await page.click('button >> text="Assign"');

			// Validate customer assigned shown in table
			// Show assign modal again
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.email}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const assignBtn = await newUser?.$('button:has-text("Assign User")');
			await assignBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Assign User")', { state: "visible" });

			// Scan Assigned customers table
			await expect(
				page.locator(`#assigned_customers >> td >> text="${TEST_CUSTOMER_REFERRER.name()}"`)
			).toBeVisible();
			await expect(page.locator(`#assigned_customers >> td >> text="${TEST_CUSTOMER_REFERRER.email}"`)).toBeVisible();
		});
	});
});
