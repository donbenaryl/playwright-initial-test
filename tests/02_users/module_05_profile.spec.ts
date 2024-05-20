import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import {
	FAKE_WALLET_ADDRESS,
	FAKE_WALLET_ADDRESS_UPDATED,
	PLAN_DETAILS,
	TEST_CUSTOMER_REFERRED,
	TEST_CUSTOMER_REFERRER,
	TEST_CUSTOMER_REFERRER_UPDATED
} from "../constants";
import { text } from "stream/consumers";
import { cleanupTransactionTestData, createTransactionTestData } from "../../db/actions";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";

test.describe("Profile Page", () => {
	test.beforeEach(async ({ page }) => {
		// Login
		await page.goto(USER_BASE_URL + "/login");
		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
		await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRER.password);
		await page.locator('button[type="submit"]').press("Enter");

		// Wait for page to load
		await page.waitForSelector(`#affiliate-hint`, { state: "visible" });

		// Load profile page
		await page.goto(USER_BASE_URL + "/profile");
	});

	test("should have avatar", async ({ page }) => {
		await page.waitForSelector(`#avatar`, { state: "visible" });
	});

	test("should show customer details", async ({ page }) => {
		await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER.firstName}"`, { state: "visible" });
		await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER.lastName}"`, { state: "visible" });
		await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER.address}"`, { state: "visible" });
		await page.waitForSelector(
			`td >> text="${TEST_CUSTOMER_REFERRER.postalCode}, ${TEST_CUSTOMER_REFERRER.city}"`,
			{ state: "visible" }
		);
		await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER.country}"`, { state: "visible" });
	});

	test("toggle wallet", async ({ page }) => {
		await page.waitForSelector(`td:has-text("******")`, { state: "visible" });

		// Show address
		const eyeIcon = await `svg[data-icon="eye"]`;
		await page.waitForSelector(eyeIcon);
		await page.click(eyeIcon);
		await page.waitForSelector(eyeIcon, { state: "hidden" });
		await page.waitForSelector(`td:has-text("******")`, { state: "hidden" });

		const eyeSlashIcon = await `svg[data-icon="eye-slash"]`;
		await page.waitForSelector(eyeSlashIcon, { state: "visible" });

		await page.waitForSelector(`td >> text="${FAKE_WALLET_ADDRESS}"`, { state: "visible" });

		// Hide address
		await page.click(eyeSlashIcon);
		await page.waitForSelector(`td >> text="${FAKE_WALLET_ADDRESS}"`, { state: "hidden" });
		await page.waitForSelector(`td:has-text("******")`, { state: "visible" });
	});

	test.describe("change password", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector(`a[data-bs-target="#updatePassword"]`, { state: "visible" });
			await page.click(`a[data-bs-target="#updatePassword"]`);
			await page.waitForSelector(`#updatePassword`, { state: "visible" });
		});

		test("should show 3 fields", async ({ page }) => {
			await page.waitForSelector(`input[name="old_password"]`, { state: "visible" });
			await page.waitForSelector(`input[name="new_password"]`, { state: "visible" });
			await page.waitForSelector(`input[name="new_password_repeat"]`, { state: "visible" });
		});

		test("should require all fields", async ({ page }) => {
			const submitBtn = `#updatePassword button[type="submit"]`;
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(3);

			await page.fill('input[name="old_password"]', "test");
			await page.click(submitBtn);
			errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(2);

			await page.fill('input[name="new_password"]', TEST_CUSTOMER_REFERRER.password);
			await page.click(submitBtn);
			errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);

			await page.fill('input[name="new_password"]', "");
			await page.fill('input[name="new_password_repeat"]', "test");
			await page.click(submitBtn);
			errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(2); // 2 errors since required new pass and password must match error
		});

		test("should match new password with valid format", async ({ page }) => {
			const submitBtn = `#updatePassword button[type="submit"]`;

			await page.fill('input[name="old_password"]', TEST_CUSTOMER_REFERRER.password);
			await page.fill('input[name="new_password"]', "testtest");
			await page.fill('input[name="new_password_repeat"]', "testtest");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("old password should be correct", async ({ page }) => {
			const submitBtn = `#updatePassword button[type="submit"]`;

			// Validate invalid password
			await page.fill('input[name="old_password"]', "invalidPasword");
			await page.fill('input[name="new_password"]', TEST_CUSTOMER_REFERRER.password);
			await page.fill('input[name="new_password_repeat"]', TEST_CUSTOMER_REFERRER.password);
			await page.click(submitBtn);
			await page.waitForSelector(`span.text-danger`, { state: "visible" });
			const errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1); // Error where old password is incorrect
		});

		test("should succeed on valid form", async ({ page }) => {
			const submitBtn = `#updatePassword button[type="submit"]`;

			// Validate invalid password
			await page.fill('input[name="old_password"]', TEST_CUSTOMER_REFERRER.password);
			await page.fill('input[name="new_password"]', TEST_CUSTOMER_REFERRER.password);
			await page.fill('input[name="new_password_repeat"]', TEST_CUSTOMER_REFERRER.password);
			await page.click(submitBtn);
			await page.waitForSelector(`span.text-danger`, { state: "hidden" });
			await expect(page.locator('div[id="updatePassword"] >> .success-message')).toBeVisible();
		});
	});

	test.describe("edit info", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector(`a[data-bs-target="#updateInfo"]`, { state: "visible" });
			await page.click(`a[data-bs-target="#updateInfo"]`);
			await page.waitForSelector(`#updateInfo`, { state: "visible" });
		});

		test("should have complete fields", async ({ page }) => {
			await page.waitForSelector(`input[name="surname"]`, { state: "visible" });
			await page.waitForSelector(`input[name="prename"]`, { state: "visible" });
			await page.waitForSelector(`input[name="address"]`, { state: "visible" });
			await page.waitForSelector(`input[name="zip"]`, { state: "visible" });
			await page.waitForSelector(`input[name="city"]`, { state: "visible" });
			await page.waitForSelector(`input[name="country"]`, { state: "visible" });
			await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		});

		test("should require last name", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="surname"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require first name", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="prename"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require address", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="address"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require zip", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="zip"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require city", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="city"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require country", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="country"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should require wallet", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="wallet"]', "");
			await page.click(submitBtn);
			let errorCount = await page.locator("span.text-danger").count();
			expect(errorCount).toBe(1);
		});

		test("should succeed on valid form", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;
			await page.fill('input[name="wallet"]', FAKE_WALLET_ADDRESS_UPDATED);
			await page.fill('input[name="surname"]', TEST_CUSTOMER_REFERRER_UPDATED.lastName);
			await page.fill('input[name="prename"]', TEST_CUSTOMER_REFERRER_UPDATED.firstName);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER_UPDATED.address);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER_UPDATED.postalCode);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER_UPDATED.city);
			await page.fill('input[name="country"]', TEST_CUSTOMER_REFERRER_UPDATED.country);
			await page.click(submitBtn);
			await expect(page.locator('div[id="updateInfo"] >> .success-message')).toBeVisible();

			await page.click(`#updateInfo .btn-close`);

			// Validate data updated in profile page
			await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER_UPDATED.firstName}"`, {
				state: "visible"
			});
			await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER_UPDATED.lastName}"`, { state: "visible" });
			await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER_UPDATED.address}"`, { state: "visible" });
			await page.waitForSelector(
				`td >> text="${TEST_CUSTOMER_REFERRER_UPDATED.postalCode}, ${TEST_CUSTOMER_REFERRER_UPDATED.city}"`,
				{ state: "visible" }
			);
			await page.waitForSelector(`td >> text="${TEST_CUSTOMER_REFERRER_UPDATED.country}"`, { state: "visible" });

			// Show wallet
			const eyeIcon = await `svg[data-icon="eye"]`;
			await page.waitForSelector(eyeIcon);
			await page.click(eyeIcon);
			await page.waitForSelector(eyeIcon, { state: "hidden" });
			await page.waitForSelector(`td >> text="${FAKE_WALLET_ADDRESS_UPDATED}"`, { state: "visible" });
		});

		test("revert data", async ({ page }) => {
			const submitBtn = `#updateInfo button[type="submit"]`;

			// Revert data
			await page.fill('input[name="wallet"]', FAKE_WALLET_ADDRESS);
			await page.fill('input[name="surname"]', TEST_CUSTOMER_REFERRER.lastName);
			await page.fill('input[name="prename"]', TEST_CUSTOMER_REFERRER.firstName);
			await page.fill('input[name="address"]', TEST_CUSTOMER_REFERRER.address);
			await page.fill('input[name="zip"]', TEST_CUSTOMER_REFERRER.postalCode);
			await page.fill('input[name="city"]', TEST_CUSTOMER_REFERRER.city);
			await page.fill('input[name="country"]', TEST_CUSTOMER_REFERRER.country);
			await page.click(submitBtn);
			await expect(page.locator('div[id="updateInfo"] >> .success-message')).toBeVisible();
		});
	});
});
