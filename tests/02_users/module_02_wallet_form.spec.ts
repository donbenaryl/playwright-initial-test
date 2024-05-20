import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { FAKE_WALLET_ADDRESS, TEST_CUSTOMER_REFERRED, TEST_CUSTOMER_REFERRER } from "../constants";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";

test.describe("Wallet form", () => {
	test.beforeEach(async ({ page }) => {
		// Login
		await page.goto(USER_BASE_URL + "/login");
		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
		await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRER.password);
		await page.locator('button[type="submit"]').press("Enter");
	});

	test("without wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });

		// Validate url
		await expect(await page.url()).toEqual(USER_BASE_URL + "/");
	});

	test("empty wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`span[role="alert"]`, { state: "hidden" });
		await page.fill('input[name="wallet"]', "");

		await page.waitForSelector('#enterWalletModal button[type="submit"]', { state: "visible" });
		await page.click('#enterWalletModal button[type="submit"]');

		await page.waitForSelector(`span[role="alert"]`, { state: "visible" });
	});

	test("invalid wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`span[role="alert"]`, { state: "hidden" });
		await page.fill('input[name="wallet"]', "invalidWalletAddress");

		await page.waitForSelector('#enterWalletModal button[type="submit"]', { state: "visible" });
		await page.click('#enterWalletModal button[type="submit"]');

		await page.waitForSelector(`span[role="alert"]`, { state: "visible" });
	});

	test("safe links exists", async ({ page }) => {
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`a >> text='Trust Wallet'`, { state: "visible" });
		const link = await page.locator(`a >> text='Trust Wallet'`).getAttribute("href");

		await expect(link).toBe("https://trustwallet.com/");
	});

	test("valid wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`span[role="alert"]`, { state: "hidden" });
		await page.fill('input[name="wallet"]', FAKE_WALLET_ADDRESS);
		
		await page.waitForSelector('#enterWalletModal button[type="submit"]', { state: "visible" });
		await page.click('#enterWalletModal button[type="submit"]');

		// Validate another modal after successful save
		await page.waitForSelector(`button[id="btn-start-now"]`, { state: "hidden" });
		await page.click('button[id="btn-start-now"]');
		await page.waitForSelector(`button[id="btn-start-now"]`, { state: "hidden" });
	});

	test("should not auto show wallet form on next login", async ({ page }) => {
		// Wallet form should be hidden
		await page.waitForSelector(`input[name="wallet"]`, { state: "hidden" });
		await page.waitForSelector(`button[id="btn-start-now"]`, { state: "hidden" });
	});
});
