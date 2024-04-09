import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const MANAGEMENT_BASE_URL = process.env.FE_MANAGEMENT_BASE_URL || "";
const TEST_USER = process.env.TEST_USER || "";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "";
const TEST_CUSTOMER_EMAIL = "customer@askrella.de";
// const TEST_NEW_ADMIN="new.admin.to.delete@askrella.de"
const TEST_TEMPORARY_USER = "user.to.delete@askrella.de";

test.describe("Management login page", () => {
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

test.describe("Validate authenticated user operations", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");
	});

	test.describe("users page", () => {
		test("user page has heading title", async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/users");

			await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
			await expect(page.locator('p >> text="A list of all our Users."')).toBeVisible();
		});

		test("user page shows list of users", async ({ page }) => {
			await page.goto(MANAGEMENT_BASE_URL + "/users");

			await expect(page.locator('th >> text="Email"')).toBeVisible();
			await expect(page.locator('th >> text="First Name"')).toBeVisible();
			await expect(page.locator('th >> text="Last Name"')).toBeVisible();
			await expect(page.locator('th >> text="Active"')).toBeVisible();

			await expect(page.locator(`td >> text="${TEST_USER}"`)).toBeVisible();
		});
	});

	test.describe("user creation", () => {
		test.beforeEach(async ({ page }) => {
			// Show create user form
			await page.goto(MANAGEMENT_BASE_URL + "/users");

			await page.getByRole("button", { name: "Create User" }).click();

			await page.waitForSelector('h3:has-text("Create User")', { state: "visible" });
		});

		test("has expected texts/labels", async ({ page }) => {
			// Form title
			await expect(page.locator(`h3 >> text="Create User"`)).toBeVisible();
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to create your new User"`)
			).toBeVisible();
			// Form labels
			await expect(page.locator(`label >> text="User Email"`)).toBeVisible();
			await expect(page.locator(`label >> text="User First Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Last Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Password"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Level"`)).toBeVisible();
		});

		test("email required", async ({ page }) => {
			await page.fill('input[name="first_name"]', "don");
			await page.fill('input[name="last_name"]', "lagadan");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("first name required", async ({ page }) => {
			await page.fill('input[name="email"]', TEST_CUSTOMER_EMAIL);
			await page.fill('input[name="last_name"]', "lagadan");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("last name required", async ({ page }) => {
			await page.fill('input[name="email"]', TEST_CUSTOMER_EMAIL);
			await page.fill('input[name="first_name"]', "don");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please complete all fields"')).toBeVisible();
		});

		test("invalid email", async ({ page }) => {
			await page.fill('input[name="email"]', "invalidEmail");
			await page.fill('input[name="first_name"]', "don");
			await page.fill('input[name="last_name"]', "lagadan");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="Please enter a valid email"')).toBeVisible();
		});

		test("should succeed on empty user level", async ({ page }) => {
			await page.fill('input[name="email"]', TEST_CUSTOMER_EMAIL);
			await page.fill('input[name="first_name"]', "don");
			await page.fill('input[name="last_name"]', "lagadan");

			await page.click('button >> text="Create"');

			// Validate user shows on the list
			await expect(page.locator(`td >> text="${TEST_USER}"`)).toBeVisible();
		});

		test("should succeed on new standard user level", async ({ page }) => {
			await page.fill('input[name="email"]', TEST_TEMPORARY_USER);
			await page.fill('input[name="first_name"]', "don");
			await page.fill('input[name="last_name"]', "lagadan");

			await page.selectOption('select[name="level"]', "1");

      // Validate level dropdown changed
      await expect(await page.locator('select[name="level"]').inputValue()).toBe("1")

			await page.click('button >> text="Create"');

      // Wait for modal to be hidden
      await page.waitForSelector('h3:has-text("Create User")', { state: "hidden" });

			// Validate user shows on the list
      const newUser = await page.locator(`td >> text="${TEST_TEMPORARY_USER}"`)
			await expect(newUser).toBeVisible();
		});
	});

  test.describe("user deletion", () => {
    // test.beforeEach(async ({ page }) => {
    // 	// Show create user form
    // 	await page.goto(MANAGEMENT_BASE_URL + "/users");
    // });

    test("delete user", async ({ page }) => {
      await page.goto(MANAGEMENT_BASE_URL + "/users");
      const selector = await `tr:has-text("${TEST_TEMPORARY_USER}")`
      // Wait for selector
      await page.waitForSelector(selector, { state: "visible" });
      
      // Click on delete button on the temporary user
      const newUser = await page.$(selector);
      const delBtn = await newUser?.$('button:has-text("Delete")');
      await delBtn?.click();

      // Wait for modal to show
      await page.waitForSelector(selector, { state: "visible" });
      // Delete user
      await page.locator('button[type="submit"]').press("Enter");

      // Wait for modal to be hidden
      await page.waitForSelector(selector, { state: "hidden" });

      // Validate user no longer exist
      const tdElement = await page.locator(`td >> text="${TEST_TEMPORARY_USER}"`);
      expect(tdElement).toHaveCount(0);
    });
  });
});
