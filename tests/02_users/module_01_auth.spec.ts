import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { TEST_CUSTOMER_REFERRED, TEST_CUSTOMER_REFERRER } from "../constants";
import { fetchResetIDByEmail } from "../../db/actions";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";
const TEST_USER = process.env.TEST_USER || "";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "";


test.describe("Request reset password", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(USER_BASE_URL + "/reset-password");
	});

	test("has reset password title", async ({ page }) => {
		// Validate in Deuch
		await expect(page).toHaveTitle("Passwort zurücksetzen | BlockB");

		// Change to english
		await page.click("#selectedLanguage");
		await page.click("#languageOptions");

		// Validate in English
		await expect(page).toHaveTitle("Reset password | BlockB");
	});

	test("has logo", async ({ page }) => {
		await page.waitForSelector(`#logo`, { state: "visible" });
	});

	test("reset password has expected labels", async ({ page }) => {
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

	test("send reset password email (referrer)", async ({ page }) => {
		await expect(await page.getByText("Anfrage neues").first()).toBeVisible();

		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);

		await page.click("button[type='submit']");

		await page.waitForSelector(
			"#resetMessage",
			{ state: "visible" }
		);

		// Validate reset id generated for email
		const resetIds = await fetchResetIDByEmail(TEST_CUSTOMER_REFERRER.email);

		await expect(resetIds && resetIds.rowCount && resetIds.rowCount > 0).toBe(true);
	});

	test("send reset password email (referred)", async ({ page }) => {
		await expect(await page.getByText("Anfrage neues").first()).toBeVisible();

		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRED.email);

		await page.click("button[type='submit']");

		await page.waitForSelector(
			"#resetMessage",
			{ state: "visible" }
		);

		// Validate reset id generated for email
		const resetIds = await fetchResetIDByEmail(TEST_CUSTOMER_REFERRED.email);

		await expect(resetIds && resetIds.rowCount && resetIds.rowCount > 0).toBe(true);
	});
});

test.describe("Reset password", () => {

	test("reset password with invalid id", async ({ page }) => {
		await page.goto(USER_BASE_URL + "/reset-password?reset_id=invalidId");

		// Validate email input still shown since reset id is not valid
		await page.waitForSelector(`input[name="email"]`, { state: "visible" });
	});

	test("reset password with id (referrer)", async ({ page }) => {
		// Validate reset id generated for email
		const resetIds = await fetchResetIDByEmail(TEST_CUSTOMER_REFERRER.email);

		await expect(resetIds && resetIds.rowCount && resetIds.rowCount > 0).toBe(true);

		await page.goto(USER_BASE_URL + "/reset-password?reset_id=" + resetIds?.rows[0].reset_id);

		await page.waitForSelector(`#new_password`, { state: "visible" });

		await page.waitForSelector(`#new_password_repeat`, { state: "visible" });

		// Fill password
		await page.fill('input[name="new_password"]', TEST_CUSTOMER_REFERRER.password);
		await page.fill('input[name="new_password_repeat"]', TEST_CUSTOMER_REFERRER.password);

		await page.locator('button[type="submit"]').press("Enter");

		// Validate redirected to login
		await page.waitForSelector(`input[name="email"]`, { state: "visible" });
		await page.waitForSelector(`input[name="password"]`, { state: "visible" });

		await expect(page.url()).toBe(USER_BASE_URL + "/login");
	});

	test("reset password with id (referred)", async ({ page }) => {
		// Validate reset id generated for email
		
		const resetIds = await fetchResetIDByEmail(TEST_CUSTOMER_REFERRED.email);

		await expect(resetIds && resetIds.rowCount && resetIds.rowCount > 0).toBe(true);

		await page.goto(USER_BASE_URL + "/reset-password?reset_id=" + resetIds?.rows[0].reset_id);

		await page.waitForSelector(`#new_password`, { state: "visible" });

		await page.waitForSelector(`#new_password_repeat`, { state: "visible" });

		// Fill password
		await page.fill('input[name="new_password"]', TEST_CUSTOMER_REFERRED.password);
		await page.fill('input[name="new_password_repeat"]', TEST_CUSTOMER_REFERRED.password);

		await page.locator('button[type="submit"]').press("Enter");

		// Validate redirected to login
		await page.waitForSelector(`input[name="email"]`, { state: "visible" });
		await page.waitForSelector(`input[name="password"]`, { state: "visible" });

		await expect(page.url()).toBe(USER_BASE_URL + "/login");
	});
});

test.describe("Login page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(USER_BASE_URL + "/login");
	});

	test("has login title", async ({ page }) => {
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

		await page.waitForSelector(`#logo`, { state: "visible" });
	});

	test("login has expected labels", async ({ page }) => {
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
		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		// Validate in Deuch
		await page.waitForURL(USER_BASE_URL + "/login");
		await expect(await page.url()).toEqual(USER_BASE_URL + "/login");
	});

	test("validate click on reset password", async ({ page }) => {
		page.getByRole("link", { name: "Passwort zurücksetzen" }).click();

		await page.waitForURL(USER_BASE_URL + "/reset-password");

		await expect(await page.url()).toEqual(USER_BASE_URL + "/reset-password");
	});

	test("should succeed on valid account", async ({ page }) => {
		// Login
		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
		await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRER.password);
		await page.locator('button[type="submit"]').press("Enter");

		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });

		// Validate url
		await expect(await page.url()).toEqual(USER_BASE_URL + "/");
	});
});
