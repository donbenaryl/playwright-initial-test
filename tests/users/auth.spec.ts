import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";
const TEST_USER = process.env.TEST_USER || "";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "";

test.describe("User login page", () => {
	test("has login title", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		// Validate in Deuch
		await expect(page).toHaveTitle("Einloggen | BlockB");

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await expect(page).toHaveTitle("Login | BlockB");
	});

	test("has logo", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		await expect(page.locator("id=logo")).toBeVisible();
	});

	test("login has expected labels", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		// Validate in Deuch
		// Heading title
		await expect(await page.getByText("Einloggen").first()).toBeVisible();
		await expect(await page.getByText("DASHBOARD").first()).toBeVisible();

		// Input labels
		await expect(page.locator('label >> text="E-Mail"')).toBeVisible();
		await expect(page.locator('label >> text="Passwort"')).toBeVisible();

		// Submit button
		await expect(page.getByRole("button", { name: "Einloggen" })).toBeVisible();

		// Link
		await expect(page.getByRole("link", { name: "Passwort zurücksetzen" })).toBeVisible();

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		// Heading title
		await expect(await page.getByText("Login").first()).toBeVisible();
		await expect(await page.getByText("DASHBOARD").first()).toBeVisible();

		// Input labels
		await expect(page.locator('label >> text="E-mail"')).toBeVisible();
		await expect(page.locator('label >> text="Password"')).toBeVisible();

		// Submit button
		await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

		// Link
		await expect(page.getByRole("link", { name: "Reset password" })).toBeVisible();

		// Validate reset password link
		const link = await page.getByRole("link", { name: "Reset password" }).getAttribute("href");
		await expect(link).toEqual("/reset-password");
	});

	test("validate all fields are required", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		await page.fill('input[name="email"]', "");
		await page.fill('input[name="password"]', "");
		await page.locator('button[type="submit"]').press("Enter");

		// Validate in Deuch
		await expect(page.locator('span >> text="E-Mail ist ein Pflichtfeld"')).toBeVisible();
		await expect(page.locator('span >> text="Passwort ist ein Pflichtfeld"')).toBeVisible();

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await page.fill('input[name="email"]', "");
		await page.fill('input[name="password"]', "");
		await page.locator('button[type="submit"]').press("Enter");

		await expect(page.locator('span >> text="E-mail is a required field"')).toBeVisible();
		await expect(page.locator('span >> text="Password is a required field"')).toBeVisible();
	});

	test("validate email", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		await page.fill('input[name="email"]', "a");
		await page.locator('button[type="submit"]').press("Enter");

		// Validate in Deuch
		await expect(page.locator('span >> text="Ungültige E-Mail"')).toBeVisible();

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await page.fill('input[name="email"]', "a");
		await page.locator('button[type="submit"]').press("Enter");

		await expect(page.locator('span >> text="Please use a valid e-mail"')).toBeVisible();
	});

	test("Invalid credentials", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		await page.fill('input[name="email"]', "wrong@user.com");
		await page.fill('input[name="password"]', "password");
		await page.locator('button[type="submit"]').press("Enter");

		// Validate in Deuch
		await expect(page.locator('div >> text="E-Mail und/oder Password falsch"')).toBeVisible();

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await page.fill('input[name="email"]', "wrong@user.com");
		await page.fill('input[name="password"]', "password");
		await page.locator('button[type="submit"]').press("Enter");

		await expect(page.locator('div >> text="E-mail and/or password incorrect"')).toBeVisible();
	});

	test("user not assigned to customer", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		// Validate in Deuch
		await page.waitForURL(USER_BASE_URL + "/login");
		await expect(await page.url()).toEqual(USER_BASE_URL + "/login");
	});

	test("validate click on reset password", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");
		page.getByRole("link", { name: "Passwort zurücksetzen" }).click();

		await page.waitForURL(USER_BASE_URL + "/reset-password");

		await expect(await page.url()).toEqual(USER_BASE_URL + "/reset-password");
	});
});

test.describe("Reset password page", () => {
	test("has reset password title", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/reset-password");

		// Validate in Deuch
		await expect(page).toHaveTitle("Passwort zurücksetzen | BlockB");

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await expect(page).toHaveTitle("Reset password | BlockB");
	});

	test("has logo", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/reset-password");

		await expect(page.locator("id=logo")).toBeVisible();
	});

	test("reset password has expected labels", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/reset-password");

		// Validate in Deuch
		// Heading title
		await expect(await page.getByText("Anfrage neues").first()).toBeVisible();
		await expect(await page.getByText("Passwort").first()).toBeVisible();

		// Input labels
		await expect(page.locator('label >> text="E-Mail"')).toBeVisible();

		// Submit button
		await expect(page.getByRole("button", { name: "E-Mail zum Zurücksetzen senden" })).toBeVisible();

		// Link
		await expect(page.locator('a >> span >> text="Zurück"')).toBeVisible();

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in Enlish
		// Heading title
		await expect(await page.getByText("Request a new").first()).toBeVisible();
		await expect(await page.getByText("Password").first()).toBeVisible();

		// Input labels
		await expect(page.locator('label >> text="E-mail"')).toBeVisible();

		// Submit button
		await expect(page.getByRole("button", { name: "Send password reset mail" })).toBeVisible();
		// Link
		await expect(page.locator('a >> span >> text="Back"')).toBeVisible();

		// Validate reset password link
		const link = await page.getByRole("link", { name: "Back" }).getAttribute("href");
		await expect(link).toEqual("/login");
	});
});
