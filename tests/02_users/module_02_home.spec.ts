import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { FAKE_WALLET_ADDRESS, TEST_CUSTOMER_REFERRED, TEST_CUSTOMER_REFERRER } from "../constants";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";

test.describe("Home page", () => {
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
		// await page.locator('button[type="submit"]').press("Enter");
		await page.click(`button:has-text("Let's go!")`);
		
		await page.waitForSelector(`span[role="alert"]`, { state: "visible" });
	});

	test("invalid wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`span[role="alert"]`, { state: "hidden" });
		await page.fill('input[name="wallet"]', "invalidWalletAddress");
		await page.click(`button:has-text("Let's go!")`);
		
		await page.waitForSelector(`span[role="alert"]`, { state: "visible" });
	});

	test("valid wallet address", async ({ page }) => {
		// Validate wallet input visible
		await page.waitForSelector(`input[name="wallet"]`, { state: "visible" });
		await page.waitForSelector(`span[role="alert"]`, { state: "hidden" });
		await page.fill('input[name="wallet"]', FAKE_WALLET_ADDRESS);
		await page.click(`button:has-text("Let's go!")`);

		// Validate wallet address input hidden
		// await page.waitForSelector(`input[name="wallet"]`, { state: "hidden" });

		// Validate another modal after successful save
		await page.waitForSelector(`button[data-bs-dismiss="modal"]`, { state: "visible" });
		
		await page.click(`button[data-bs-dismiss="modal"]`);
	});
});
