import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { FAKE_WALLET_ADDRESS, PLAN_DETAILS, TEST_CUSTOMER_REFERRED, TEST_CUSTOMER_REFERRER } from "../constants";
import { text } from "stream/consumers";
import { cleanupTransactionTestData, createTransactionTestData } from "../../db/actions";
dotenv.config();

const USER_BASE_URL = process.env.FE_USER_BASE_URL || "";

test.describe("Home Page", () => {
	test.beforeEach(async ({ page }) => {
		// Login
		await page.goto(USER_BASE_URL + "/login");
		await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRER.email);
		await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRER.password);
		await page.locator('button[type="submit"]').press("Enter");
	});

	test.describe("affiliate notice", () => {
		test("should initially show affiliate hint", async ({ page }) => {
			await page.waitForSelector(`#affiliate-hint`, { state: "visible" });
		});

		test("should show affiliate model on click", async ({ page }) => {
			await page.waitForSelector(`#affiliate-hint`, { state: "visible" });

			await page.click(`#affiliate-hint div`);

			await page.waitForSelector("#affiliateModal", { state: "visible" });
		});

		test("should hide hint on clicking x", async ({ page }) => {
			await page.waitForSelector(`#affiliate-hint`, { state: "visible" });

			await page.click(`#affiliate-hint svg`);

			await page.waitForSelector("#affiliate-hint", { state: "hidden" });
		});
	});

	test.describe("contract", () => {
		test("should show assigned contract", async ({ page }) => {
			await page.waitForSelector(`.contract-container`, { state: "visible" });
			const contractCount = await page.$$eval(".contract-container", contract => contract.length);

			await expect(contractCount).toBe(1);
		});

		test("should show plan name", async ({ page }) => {
			await page.waitForSelector(`.contract-container >> text="${PLAN_DETAILS.name}"`, { state: "visible" });
		});

		test("should show terahashes", async ({ page }) => {
			await page.waitForSelector(`.contract-container >> text="${PLAN_DETAILS.terahashes} TH/s"`, {
				state: "visible"
			});
		});

		test("should initially hide details", async ({ page }) => {
			await page.waitForSelector(`.contract-container >> table`, { state: "hidden" });
		});

		test("should initially hide cancel package button", async ({ page }) => {
			await page.waitForSelector(`.contract-container >> a`, { state: "hidden" });
		});

		test("should show details", async ({ page }) => {
			await page.waitForSelector(`.contract-container >> button`, { state: "visible" });
			await page.click(`.contract-container >> button`);

			// Validate cancel package is shown
			await page.waitForSelector(`.contract-container >> a`, { state: "visible" });

			// Validate 6 details shown
			const trCount = await page.$$eval(`.contract-container tr`, tr => tr.length);
			await expect(trCount).toBe(6);
		});
	});

	test.describe("cancel contract", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector(`.contract-container >> button`, { state: "visible" });
			await page.click(`.contract-container >> button`);
			await page.waitForSelector(`.contract-container >> a`, { state: "visible" });
		});

		test("should initially hide cancel contract package", async ({ page }) => {
			await page.waitForSelector(`#cancelPlanModal`, { state: "hidden" });
		});

		test("should show cancel package on cancel button click", async ({ page }) => {
			await page.locator(`.contract-container >> a`).click();

			await page.waitForSelector(`#cancelPlanModal`, { state: "visible" });
		});

		test("should success even on empty text field", async ({ page }) => {
			await page.locator(`.contract-container >> a`).click();

			await page.waitForSelector(`#cancelPlanModal`, { state: "visible" });

			await page.click(`#cancelPlanModal >> button`);
		});
	});

	test("should show choose your package", async ({ page }) => {
		await page.waitForSelector(`a[data-bs-target="#addPlanModal"]`, { state: "visible" });
	});

	test.describe("choose your package", () => {
		test.beforeEach(async ({ page }) => {
			await page.waitForSelector(`a[data-bs-target="#addPlanModal"]`, { state: "visible" });
			await page.click(`a[data-bs-target="#addPlanModal"]`);
		});

		test("should show 2 fields", async ({ page }) => {
			await page.waitForSelector(`#addPlanModal >> input[name="packageQuantity"]`, { state: "hidden" });
			await page.waitForSelector(`#addPlanModal >> textarea[name="other"]`, { state: "hidden" });
		});

		test("amount should initially be 1", async ({ page }) => {
			await expect(page.locator(`#addPlanModal >> input[name="packageQuantity"]`)).toHaveValue("1");
		});

		test("textarea should be initially empty", async ({ page }) => {
			await expect(page.locator(`#addPlanModal >> textarea[name="other"]`)).toHaveValue("");
		});

		test("should not have error shown initially", async ({ page }) => {
			await page.waitForSelector(`#addPlanModal >> span[role="alert"]`, { state: "hidden" });
		});

		test("should require amount", async ({ page }) => {
			await page.fill('#addPlanModal >> input[name="packageQuantity"]', "");

			await page.click('#addPlanModal button[type="submit"]');

			await page.waitForSelector(`#addPlanModal >> span[role="alert"]`, { state: "visible" });
		});

		test("should succeed on empty textarea", async ({ page }) => {
			await page.fill('#addPlanModal >> textarea[name="other"]', "");

			await page.click('#addPlanModal button[type="submit"]');

			await page.waitForSelector(`#addPlanModal >> .success-message`, { state: "visible" });

			// Validate back to form
			await page.waitForSelector(`#addPlanModal >> .success-message`, { state: "hidden" });
			await page.waitForSelector(`#addPlanModal >> input[name="packageQuantity"]`, { state: "visible" });
			await page.waitForSelector(`#addPlanModal >> textarea[name="other"]`, { state: "visible" });
		});

		test("should succeed on textarea not empty", async ({ page }) => {
			await page.fill('#addPlanModal >> textarea[name="other"]', "This is a test (E2E). Please ignore.");

			await page.click('#addPlanModal button[type="submit"]');

			await page.waitForSelector(`#addPlanModal >> .success-message`, { state: "visible" });

			// Validate back to form
			await page.waitForSelector(`#addPlanModal >> .success-message`, { state: "hidden" });
			await page.waitForSelector(`#addPlanModal >> input[name="packageQuantity"]`, { state: "visible" });
			await page.waitForSelector(`#addPlanModal >> textarea[name="other"]`, { state: "visible" });
		});
	});

	test.describe("generated so far", () => {
		test("should show clickable icon", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalSavings"]', { state: "visible" });
		});

		test("should show generated so far details", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalSavings"]', { state: "visible" });
			await page.click(`a[data-bs-target="#infoModalSavings"]`);
			await page.waitForSelector("#infoModalSavings", { state: "visible" });
		});

		test("should contain 3 btc details", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalSavings"]', { state: "visible" });

			const container = await page.locator('a[data-bs-target="#infoModalSavings"]').locator("..").locator("..");

			const texts = await container.allTextContents();

			// Concatenate all text contents into a single string
			const combinedText = await texts.join(" ");

			// Count occurrences of " BTC"
			const occurrences = await (combinedText.match(/ BTC/g) || []).length;

			// Validate 3 details with "BTC"
			await expect(occurrences).toBe(3);
		});
	});

	test.describe("profitability/difficulty", () => {
		test("should show clickable icon", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalDifficulty"]', { state: "visible" });
		});

		test("should show profitability details", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalDifficulty"]', { state: "visible" });
			await page.click(`a[data-bs-target="#infoModalDifficulty"]`);
			await page.waitForSelector("#infoModalDifficulty", { state: "visible" });
		});

		test("should contain a canvas where graph is shown", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalDifficulty"]', { state: "visible" });

			const canvas = await page
				.locator('a[data-bs-target="#infoModalDifficulty"]')
				.locator("..")
				.locator("..")
				.locator("canvas");

			await expect(canvas).toHaveCount(2);
		});
	});

	test.describe("computing power", () => {
		test("should show clickable icon", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalComputing"]', { state: "visible" });
		});

		test("should show profitability details", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalComputing"]', { state: "visible" });
			await page.click(`a[data-bs-target="#infoModalComputing"]`);
			await page.waitForSelector("#infoModalComputing", { state: "visible" });
		});

		test("should contain terahashes", async ({ page }) => {
			await page.waitForSelector('a[data-bs-target="#infoModalComputing"]', { state: "visible" });

			const container = await page.locator('a[data-bs-target="#infoModalComputing"]').locator("..").locator("..");

			const texts = await container.allTextContents();

			// Concatenate all text contents into a single string
			const combinedText = await texts.join(" ");

			// Count occurrences of " TH"
			const occurrences = await (combinedText.match(/ TH/g) || []).length;

			// Validate 3 details with "TH"
			await expect(occurrences).toBe(1);
		});
	});

	test.describe("transactions", () => {
		test("should show container", async ({ page }) => {
			await page.waitForSelector("#transactions-container", { state: "visible" });
		});

		test("should not contain table on empty transaction", async ({ page }) => {
			await page.waitForSelector("#transactions-container table", { state: "hidden" });
		});

		test("should display transactions with pagination", async ({ page }) => {
			// Create transaction test data
			await createTransactionTestData(TEST_CUSTOMER_REFERRER.email);

			// Validate transactions displayed
			await page.waitForSelector("#transactions-container table", { state: "visible" });
			let dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(11); // 10 rows + header

			// Change page size to 5
			await page.click(`#transactions-container .p-dropdown-label`);
			await page.waitForSelector(`.p-dropdown-panel`, { state: "visible" });

			await page.click(`.p-dropdown-panel >> li >> text="5"`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(6);

			// Change page size to 20
			await page.click(`#transactions-container .p-dropdown-label`);
			await page.waitForSelector(`.p-dropdown-panel`, { state: "visible" });

			await page.click(`.p-dropdown-panel >> li >> text="20"`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(21);

			// Change page size to 50
			await page.click(`#transactions-container .p-dropdown-label`);
			await page.waitForSelector(`.p-dropdown-panel`, { state: "visible" });

			await page.click(`.p-dropdown-panel >> li >> text="50"`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(51);

			// Cleanup transaction test data
			await cleanupTransactionTestData(TEST_CUSTOMER_REFERRER.email)
		});

		test("pagination should work", async ({ page }) => {
			// Create transaction test data
			await createTransactionTestData(TEST_CUSTOMER_REFERRER.email);

			// Validate transactions displayed
			await page.waitForSelector("#transactions-container table", { state: "visible" });
			let dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(11); // 10 rows + header

			// Next button
			await page.click(`button[data-pc-section="nextpagebutton"]`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(11); // 10 rows + header
			// Validate highlighted number
			await page.locator(`.p-highlight >> text="2"`)

			// Last page button
			await page.click(`button[data-pc-section="lastpagebutton"]`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(10); // 9 rows + header
			// Validate highlighted number
			await page.locator(`.p-highlight >> text="10"`)

			// Previous button
			await page.click(`button[data-pc-section="previouspagebutton"]`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(11); // 10 rows + header
			// Validate highlighted number
			await page.locator(`.p-highlight >> text="9"`)

			// First page button
			await page.click(`button[data-pc-section="firstpagebutton"]`);
			dataCount = await page.locator("#transactions-container tr").count();
			expect(dataCount).toBe(11); // 10 rows + header
			// Validate highlighted number
			await page.locator(`.p-highlight >> text="1"`)

			// Cleanup transaction test data
			await cleanupTransactionTestData(TEST_CUSTOMER_REFERRER.email)
		});
	});
});
