import { test, expect } from "@playwright/test";
import {
	MANAGEMENT_BASE_URL,
	PLAN_DETAILS,
	TEST_CUSTOMER_REFERRED,
	TEST_CUSTOMER_REFERRER,
	TEST_PASSWORD,
	TEST_USER
} from "../constants";

test.describe("Contracts page", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");

		await page.goto(MANAGEMENT_BASE_URL + "/contracts");
	});

	test.describe("contracts page", () => {
		test("should redirect to login page when unauthenticated", async ({ page }) => {
			await page.click('button >> text="Logout"');

			await page.goto(MANAGEMENT_BASE_URL + "/contracts");

			await expect(page.url()).toBe(MANAGEMENT_BASE_URL + "/login");
		});

		test("contract page has heading title", async ({ page }) => {
			await expect(page.getByRole("heading", { name: "Contracts" })).toBeVisible();
			await expect(page.locator('p >> text="A list of all our Contracts."')).toBeVisible();
		});

		test("contract page shows list of contracts", async ({ page }) => {
			await expect(page.locator('th >> text="Customer"')).toBeVisible();
			await expect(page.locator('th >> text="Contract No."')).toBeVisible();
			await expect(page.locator('th >> text="Contract Type"')).toBeVisible();
			await expect(page.locator('th >> text="Start Date"')).toBeVisible();
		});
	});

	test.describe("contract creation", () => {
		const currentDate = new Date();

		// Get day, month, and year
		const day = currentDate.getDate().toString().padStart(2, "0");
		const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
		const year = currentDate.getFullYear();
		const formattedDate = `${day}/${month}/${year}`;

		test.beforeEach(async ({ page }) => {
			await page.getByRole("button", { name: "Create Contract" }).click();

			await page.waitForSelector('h3:has-text("Create Contract")', { state: "visible" });

			const planId = await page.locator(`option >> text="${PLAN_DETAILS.name}"`).getAttribute("value");

			await page.selectOption('select[name="plan_id"]', planId);
		});

		test("should have expected labels", async ({ page }) => {
			// Form title
			await expect(page.locator(`h3 >> text="Create Contract"`)).toBeVisible();
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to create your new Contract"`)
			).toBeVisible();
			// Form labels
			await page.waitForSelector('label:has-text("Customer")', { state: "visible" });
			await expect(page.locator(`label >> text="Plan"`)).toBeVisible();
			await expect(page.locator(`label >> text="Start Date"`)).toBeVisible();
		});

		test("customer required", async ({ page }) => {
			await page.click('input[name="start_date"]');
			await page.keyboard.type(formattedDate);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("start date required", async ({ page }) => {
			const customerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRER.name()}"`)
				.getAttribute("value");

			await page.selectOption('select[name="customer_id"]', customerId);

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("plan required", async ({ page }) => {
			await page.click('input[name="start_date"]');
			await page.keyboard.type(formattedDate);
			const customerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRER.name()}"`)
				.getAttribute("value");

			await page.selectOption('select[name="customer_id"]', customerId);

			await page.selectOption('select[name="plan_id"]', "default");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("create referrer contract", async ({ page }) => {
			await page.click('input[name="start_date"]');
			await page.keyboard.type(formattedDate);
			const customerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRER.name()}"`)
				.getAttribute("value");
			await page.selectOption('select[name="customer_id"]', customerId);

			await page.click('button >> text="Create"');

			await page.waitForSelector('h3:has-text("Create Contract")', { state: "hidden" });
		});

		test("create referred contract", async ({ page }) => {
			await page.click('input[name="start_date"]');
			await page.keyboard.type(formattedDate);
			const customerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRED.name()}"`)
				.getAttribute("value");
			await page.selectOption('select[name="customer_id"]', customerId);

			await page.click('button >> text="Create"');

			await page.waitForSelector('h3:has-text("Create Contract")', { state: "hidden" });
		});

		test("create contract to delete", async ({ page }) => {
			await page.click('input[name="start_date"]');
			await page.keyboard.type(formattedDate);
			const customerId = await page
				.locator(`option >> text="${TEST_CUSTOMER_REFERRED.name()}"`)
				.getAttribute("value");
			await page.selectOption('select[name="customer_id"]', customerId);

			await page.click('button >> text="Create"');

			await page.waitForSelector('h3:has-text("Create Contract")', { state: "hidden" });
		});
	});

	test.describe("contract deletion", () => {
		test("delete contract", async ({ page }) => {
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
			await expect(tdElement).toHaveCount(1);
		});
	});
});
