import { test, expect } from "@playwright/test";
import {
	MANAGEMENT_BASE_URL,
	PLAN_DETAILS,
	TEST_PASSWORD,
	TEST_USER
} from "../constants";

test.describe("Plans page", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");

		await page.goto(MANAGEMENT_BASE_URL + "/plans");
	});

	test.describe("plans page", () => {
		test("should redirect to login page when unauthenticated", async ({ page }) => {
			await page.click('button >> text="Logout"');

			await page.goto(MANAGEMENT_BASE_URL + "/plans");

			await expect(page.url()).toBe(MANAGEMENT_BASE_URL + "/login");
		});

		test("plans page has heading title", async ({ page }) => {
			await expect(page.getByRole("heading", { name: "Plans" })).toBeVisible();
			await expect(page.locator('p >> text="A list of all our Plans."')).toBeVisible();
		});

		test("plan page shows list of plans", async ({ page }) => {
			await expect(page.locator('th >> text="Plan Name"')).toBeVisible();
			await expect(page.locator('th >> text="Amount"')).toBeVisible();
			await expect(page.locator('th >> text="Terahashes"')).toBeVisible();
			await expect(page.locator('th >> text="Duration"')).toBeVisible();
			await expect(page.locator('th >> text="Active"')).toBeVisible();
		});
	});

	test.describe("plan creation", () => {
		test.beforeEach(async ({ page }) => {
			await page.getByRole("button", { name: "Create Plan" }).click();

			await page.waitForSelector('h3:has-text("Create Plan")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Form title
			await expect(page.locator(`h3 >> text="Create Plan"`)).toBeVisible();
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to create your new Plan"`)
			).toBeVisible();
			// Form labels
			await expect(page.locator(`label >> text="Plan Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="Amount"`)).toBeVisible();
			await expect(page.locator(`label >> text="Tera Hashes"`)).toBeVisible();
			await expect(page.locator(`label >> text="Duration Days"`)).toBeVisible();
		});

		test("plan name required", async ({ page }) => {
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Plan name required"')).toBeVisible();
		});

		test("amount required", async ({ page }) => {
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Amount should be a valid number"')).toBeVisible();
		});

		test("amount should be a number", async ({ page }) => {
			await page.fill('input[name="amount"]', "invalidNumber");
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Amount should be a valid number"')).toBeVisible();
		});

		test("terahashes required", async ({ page }) => {
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Tera hashes should be a valid number"')).toBeVisible();
		});

		test("terahashes should be a number", async ({ page }) => {
			await page.fill('input[name="tera_hashes"]', "invalidNumber");
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Tera hashes should be a valid number"')).toBeVisible();
		});

		test("duration days required", async ({ page }) => {
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Duration days should be a valid number"')).toBeVisible();
		});

		test("duration days should be a number", async ({ page }) => {
			await page.fill('input[name="duration_days"]', "invalidNumber");
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Duration days should be a valid number"')).toBeVisible();
		});
		
		test("should succeed on valid form", async ({ page }) => {
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name);
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());

			await page.click('button >> text="Create"');

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.name}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.amount}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.terahashes}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.durationDays}")`, { state: "visible" });
		});

		test("create plan to delete", async ({ page }) => {
			await page.fill('input[name="duration_days"]', PLAN_DETAILS.durationDays.toString());
			await page.fill('input[name="plan_name"]', PLAN_DETAILS.name+"toDelete");
			await page.fill('input[name="tera_hashes"]', PLAN_DETAILS.terahashes.toString());
			await page.fill('input[name="amount"]', PLAN_DETAILS.amount.toString());

			await page.click('button >> text="Create"');

			// Validate customer shows on the list
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.name}toDelete")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.amount}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.terahashes}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${PLAN_DETAILS.durationDays}")`, { state: "visible" });
		});
	});

	test.describe("plan deletion", () => {
		test("delete plan", async ({ page }) => {
			const selector = await `tr:has-text("${PLAN_DETAILS.name}toDelete")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Deactivate")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(`h3:has-text("Deactivate Plan ${PLAN_DETAILS.name}toDelete")`, {
				state: "visible"
			});
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${PLAN_DETAILS.name}toDelete"`);
			expect(tdElement).toHaveCount(0);
		});
	});
});
