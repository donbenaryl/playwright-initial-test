import { test, expect } from "@playwright/test";
import { MANAGEMENT_BASE_URL, TEST_PASSWORD, TEST_USER } from "../constants";

test.describe("Login page", () => {
	test("has title", async ({ page }) => {
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await expect(page).toHaveTitle("RAM");
	});

	test("login has expected labels", async ({ page }) => {
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		// Input labels
		await expect(page.locator('label >> text="Email address"')).toBeVisible();
		await expect(page.locator('label >> text="Password"')).toBeVisible();

		// Submit button
		await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
	});

	test("validate all fields are required", async ({ page }) => {
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', "");
		await page.fill('input[name="password"]', "");
		await page.locator('button[type="submit"]').press("Enter");

		// Validate user still in login page
		await expect(await page.url()).toEqual(MANAGEMENT_BASE_URL + "/login");
	});

	test("fail on invalid credentials", async ({ page }) => {
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', "wrong@email.com");
		await page.fill('input[name="password"]', "password");
		await page.locator('button[type="submit"]').press("Enter");

		// Validate error message
		await expect(page.locator('p >> text="Invalid Email or Password"')).toBeVisible();
	});

	test("success on valid credentials", async ({ page }) => {
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");
		const url = await page.url();
		console.log({ url });

		// Validate user in dashboard page
		await page.waitForURL(MANAGEMENT_BASE_URL + "/");
		await expect(await page.url()).toEqual(MANAGEMENT_BASE_URL + "/");
	});
});
