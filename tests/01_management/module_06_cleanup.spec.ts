import { test, expect } from "@playwright/test";
import {
	MANAGEMENT_BASE_URL,
	PLAN_DETAILS,
	TEST_CUSTOMER_REFERRED,
	TEST_CUSTOMER_REFERRER,
	TEST_PASSWORD,
	TEST_USER
} from "../constants";

test.describe("Cleanup test data", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");
	});

	test.describe("cleanup contracts", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/contracts");
		});

		test("delete referred contract", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			const contractId = await page.textContent(
				`tr:has-text("${TEST_CUSTOMER_REFERRED.name()}") > td:nth-child(2)`
			);
			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Delete Contract ${contractId}")`, {
				state: "visible"
			});
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(`h3:has-text("Delete Contract ${contractId}")`, {
				state: "hidden"
			});

			// Validate the contract no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRED.name()}"`);
			await expect(tdElement).toHaveCount(0);
		});

		test("delete referrer contract", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.name()}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			const contractId = await page.textContent(
				`tr:has-text("${TEST_CUSTOMER_REFERRER.name()}") > td:nth-child(2)`
			);
			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Delete Contract ${contractId}")`, {
				state: "visible"
			});
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(`h3:has-text("Delete Contract ${contractId}")`, {
				state: "hidden"
			});

			// Validate the contract no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRER.name()}"`);
			await expect(tdElement).toHaveCount(0);
		});
	});

	test.describe("cleanup plans", () => {
		test("delete plan", async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/plans");

			const selector = await `tr:has-text("${PLAN_DETAILS.name}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });
			
			await page.click(`${selector} >> button:has-text("Deactivate")`)

			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Deactivate Plan ${PLAN_DETAILS.name}")`, {
				state: "visible"
			});
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(`h3:has-text("Deactivate Plan ${PLAN_DETAILS.name}")`, {
				state: "hidden"
			});

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${PLAN_DETAILS.name}"`);
			expect(tdElement).toHaveCount(0);
		});
	});

	test.describe("cleanup customers", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/customers");
		});

		test("delete referred customer", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.name()}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the  customer
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Delete Customer ${TEST_CUSTOMER_REFERRED.name()}")`, {
				state: "visible"
			});
			// Delete customer
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate customer no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRED.name()}"`);
			expect(tdElement).toHaveCount(0);
		});

		test("delete referrer customer", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.name()}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the customer
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Delete Customer ${TEST_CUSTOMER_REFERRER.name()}")`, {
				state: "visible"
			});
			// Delete customer
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate customer no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRER.name()}"`);
			expect(tdElement).toHaveCount(0);
		});
	});

	test.describe("cleanup users", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/users");
		});

		test("delete referred user", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRED.email}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(selector, { state: "visible" });
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRED.email}"`);
			expect(tdElement).toHaveCount(0);
		});

		test("delete referrer user", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.email}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(selector, { state: "visible" });
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRER.email}"`);
			expect(tdElement).toHaveCount(0);
		});
	});
});
