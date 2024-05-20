import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { FAKE_WALLET_ADDRESS, TEST_CUSTOMER_REFERRED, TEST_CUSTOMER_REFERRER } from "../constants";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";

test.describe("Header", () => {
	test.beforeEach(async ({ page }) => {
		// Login
		await page.goto(USER_BASE_URL + "/login");
		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
		await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRER.password);
		await page.locator('button[type="submit"]').press("Enter");
	});

	test.describe("help desk link", () => {
		test("should contain contact support", async ({ page }) => {
			await page.waitForSelector(`a >> text="helpdesk@block-b.de"`, { state: "visible" });
		});

		test("should initially hide support modal", async ({ page }) => {
			await page.waitForSelector(`div[id="supportModal"]`, { state: "hidden" });
		});

		test("should show contact support", async ({ page }) => {
			await page.waitForSelector(`a >> text="helpdesk@block-b.de"`, { state: "visible" });
			await page.click(`a >> text="helpdesk@block-b.de"`);
			await page.waitForSelector(`div[id="supportModal"]`, { state: "visible" });
		});
	});

	test.describe("help desk form", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector(`a >> text="helpdesk@block-b.de"`, { state: "visible" });
			await page.click(`a >> text="helpdesk@block-b.de"`);
			await page.waitForSelector(`div[id="supportModal"]`, { state: "visible" });
		});

		test("should fail on empty category and description", async ({ page }) => {
			const submitSelector = `div[id="supportModal"] >> button[type="submit"]`;
			await page.waitForSelector(submitSelector, { state: "visible" });
			await page.click(submitSelector);

			await expect(page.locator('div[id="supportModal"] >> .failure-message')).toBeVisible();
		});

		test("should fail on empty description and category filled", async ({ page }) => {
			await page.fill("textarea[name='supportComment']", "");
			const submitSelector = `div[id="supportModal"] >> button[type="submit"]`;
			await page.waitForSelector(submitSelector, { state: "visible" });
			await page.click(submitSelector);

			await expect(page.locator('div[id="supportModal"] >> .failure-message')).toBeVisible();
		});

		test("should succeed on valid form", async ({ page }) => {
			await page.fill("textarea[name='supportComment']", "Test description from E2E");
			const submitSelector = `div[id="supportModal"] >> button[type="submit"]`;
			await page.waitForSelector(submitSelector, { state: "visible" });
			await page.click(submitSelector);

			await expect(page.locator('div[id="supportModal"] >> .success-message')).toBeVisible();
		});
	});

	test.describe("language", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector("a[href='/profile']", { state: "visible" });
		});

		test("should only initially show selected language", async ({ page }) => {
			const btnCount = await page.$$eval("#languageSelector button", buttons => buttons.length);
			await expect(btnCount).toBe(1);
		});

		test("should have 2 options", async ({ page }) => {
			await page.click("#selectedLanguage");
			const btnCount = await page.$$eval("#languageSelector button", buttons => buttons.length);
			await expect(btnCount).toBe(2);
		});

		test("default language should be deutsch", async ({ page }) => {
			await page.waitForSelector('#selectedLanguage:has-text("Deutsch")', { state: "visible" });
		});

		test("should succeed on switching to english", async ({ page }) => {
			await page.click("#selectedLanguage");
			await page.waitForSelector("#languageOptions", { state: "visible" });
			await page.click("#languageOptions");

			await page.waitForSelector('#selectedLanguage:has-text("English")', { state: "visible" });
		});
	});

	test.describe("navigation", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector("a[href='/profile']", { state: "visible" });
		});

		test("should have 3 links", async ({ page }) => {
			const aCount = await page.$$eval("#nav-links a", anchor => anchor.length);
			await expect(aCount).toBe(3);
		});

		test("first link should redirect to profile page", async ({ page }) => {
			await page.click("#nav-links >> a:nth-child(1)");

			await page.waitForURL(USER_BASE_URL + "/profile");
		});

		test("second link should show affiliate modal", async ({ page }) => {
			await page.click("#nav-links >> a:nth-child(2)");
			
			await page.waitForSelector("#affiliateModal", { state: "visible" });
		});

		test("second link logs out user", async ({ page }) => {
			await page.click("#nav-links >> a:nth-child(3)");

			await page.waitForURL(USER_BASE_URL + "/login");
		});
	});

	test.describe("logo", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector("a[href='/profile']", { state: "visible" });
		});

		test("should be visible", async ({ page }) => {
			await page.waitForSelector("#logo", { state: "visible" });
		});

		test("should redirect to home on click", async ({ page }) => {
			await page.goto(USER_BASE_URL + "/profile");
			await page.click("#logo")
			
			await page.waitForURL(USER_BASE_URL + "/");
		});
	});
});
