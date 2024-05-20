import { test, expect } from "@playwright/test";
import {
	MANAGEMENT_BASE_URL,
	TEST_CUSTOMER_REFERRED,
	TEST_CUSTOMER_REFERRER,
	TEST_PASSWORD,
	TEST_TEMPORARY_USER,
	TEST_USER
} from "../constants";

test.describe("Users page", () => {
	test.beforeEach(async ({ page }) => {
		// Authenticate on each request
		await page.goto(MANAGEMENT_BASE_URL + "/login");

		await page.fill('input[name="email"]', TEST_USER);
		await page.fill('input[name="password"]', TEST_PASSWORD);
		await page.locator('button[type="submit"]').press("Enter");

		await page.waitForURL(MANAGEMENT_BASE_URL + "/");

		await page.goto(MANAGEMENT_BASE_URL + "/users");
	});

	test.describe("users page", () => {
		test("should redirect to login page when unauthenticated", async ({ page }) => {
			await page.click('button >> text="Logout"');

			await page.goto(MANAGEMENT_BASE_URL + "/users");

			await expect(page.url()).toBe(MANAGEMENT_BASE_URL + "/login");
		});

		test("user page has heading title", async ({ page }) => {
			await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
			await expect(page.locator('p >> text="A list of all our Users."')).toBeVisible();
		});

		test("user page shows list of users", async ({ page }) => {
			await expect(page.locator('th >> text="Email"')).toBeVisible();
			await expect(page.locator('th >> text="First Name"')).toBeVisible();
			await expect(page.locator('th >> text="Last Name"')).toBeVisible();
			await expect(page.locator('th >> text="Active"')).toBeVisible();

			await expect(page.locator(`td >> text="${TEST_USER}"`)).toBeVisible();
		});
	});

	test.describe("user creation", () => {
		test.beforeEach(async ({ page }) => {
			await page.getByRole("button", { name: "Create User" }).click();

			await page.waitForSelector('h3:has-text("Create User")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Form title
			await expect(page.locator(`h3 >> text="Create User"`)).toBeVisible();
			// Form hint
			await expect(
				page.locator(`p >> text="Please fill in the necessary information to create User"`)
			).toBeVisible();
			// Form labels
			await expect(page.locator(`label >> text="User Email"`)).toBeVisible();
			await expect(page.locator(`label >> text="User First Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Last Name"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Password"`)).toBeVisible();
			await expect(page.locator(`label >> text="User Level"`)).toBeVisible();
		});

		test("email required", async ({ page }) => {
			await page.fill('input[name="first_name"]', "John");
			await page.fill('input[name="last_name"]', "Doe");

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Please enter a valid email"')).toBeVisible();
		});

		test("first name required", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('input[name="last_name"]', "Doe");

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="First name required"')).toBeVisible();
		});

		test("last name required", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('input[name="first_name"]', "John");

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Last name required"')).toBeVisible();
		});

		test("invalid email", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', "invalidEmail");
			await page.fill('input[name="first_name"]', "John");
			await page.fill('input[name="last_name"]', "Doe");

			await page.click('button >> text="Create"');

			await expect(page.locator('span >> text="Please enter a valid email"')).toBeVisible();
		});

		test("should succeed on empty user level", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_CUSTOMER_REFERRER.email);
			await page.fill('input[name="first_name"]', TEST_CUSTOMER_REFERRER.firstName);
			await page.fill('input[name="last_name"]', TEST_CUSTOMER_REFERRER.lastName);

			await page.click('button >> text="Create"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Create User")', { state: "hidden" });

			// Validate user shows on the list
			await expect(page.locator(`td >> text="${TEST_CUSTOMER_REFERRER.email}"`)).toBeVisible();
		});

		test("should succeed on new standard user level", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_TEMPORARY_USER);
			await page.fill('input[name="first_name"]', "John");
			await page.fill('input[name="last_name"]', "Doe");

			await page.selectOption('select[name="level"]', "1");

			// Validate level dropdown changed
			await expect(await page.locator('select[name="level"]').inputValue()).toBe("1");

			await page.click('button >> text="Create"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Create User")', { state: "hidden" });

			// Validate user shows on the list
			const newUser = await page.locator(`td >> text="${TEST_TEMPORARY_USER}"`);
			await expect(newUser).toBeVisible();
		});

		test("should fail when creating existing user", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_TEMPORARY_USER);
			await page.fill('input[name="first_name"]', "John");
			await page.fill('input[name="last_name"]', "Doe");

			await page.selectOption('select[name="level"]', "1");

			// Validate level dropdown changed
			await expect(await page.locator('select[name="level"]').inputValue()).toBe("1");

			await page.click('button >> text="Create"');

			await expect(page.locator('p >> text="User already exist"')).toBeVisible();
		});

		test("create referred user", async ({ page }) => {
			await page.fill('input[id="create_user_email"]', TEST_CUSTOMER_REFERRED.email);
			await page.fill('input[name="first_name"]', TEST_CUSTOMER_REFERRED.firstName);
			await page.fill('input[name="last_name"]', TEST_CUSTOMER_REFERRED.lastName);

			await page.selectOption('select[name="level"]', "1");

			// Validate level dropdown changed
			await expect(await page.locator('select[name="level"]').inputValue()).toBe("1");

			await page.click('button >> text="Create"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Create User")', { state: "hidden" });

			// Validate user shows on the list
			const newUser = await page.locator(`td >> text="${TEST_CUSTOMER_REFERRED.email}"`);
			await expect(newUser).toBeVisible();
		});

		test("should allow password to change", async ({ page }) => {
			const defaultPassword = await page.locator('input[name="password"]').inputValue()
			await page.click('input[name="password"]');
			await page.keyboard.type('1');

			// Validate password type
			expect(await page.locator('input[name="password"]').getAttribute("type")).toBe("password")

			// Validate showing password
			await page.click('input[name="password"] + svg');
			expect(await page.locator('input[name="password"]').getAttribute("type")).toBe("text")

			// Validate hiding password again
			await page.click('input[name="password"] + svg');
			expect(await page.locator('input[name="password"]').getAttribute("type")).toBe("password")

			// Change default password
			await page.fill('input[name="password"]', TEST_CUSTOMER_REFERRED.password);
			expect(await page.locator('input[name="password"]').inputValue()).not.toBe(defaultPassword)
			expect(await page.locator('input[name="password"]').inputValue()).toBe(TEST_CUSTOMER_REFERRED.password)
		});
	});

	test.describe("user update", () => {
		test.beforeEach(async ({ page }) => {
			const selector = await `tr:has-text("${TEST_TEMPORARY_USER}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const updateBtn = await newUser?.$('button:has-text("Details")');
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update User")', { state: "visible" });
		});

		test("should fail on empty last name", async ({ page }) => {
			// Empty out last name
			await page.fill('input[name="last_name"]', "");

			// Click update user button
			await page.click('button >> text="Update"');

			// Validate error message
			await expect(page.locator('span >> text="Last name required"')).toBeVisible();
		});

		test("should fail on empty first name", async ({ page }) => {
			// Empty out first name
			await page.fill('input[name="first_name"]', "");

			// Click update user button
			await page.click('button >> text="Update"');

			// Validate error message
			await expect(page.locator('span >> text="First name required"')).toBeVisible();
		});

		test("should succeed on updating fields", async ({ page }) => {
			const updatedFirstName = "Mary";
			const updatedLastName = "Grace";

			await page.fill('input[name="first_name"]', updatedFirstName);
			await page.fill('input[name="last_name"]', updatedLastName);

			// Click update user button
			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update User")', { state: "hidden" });

			// Validate data update on table
			await page.waitForSelector(`tr:has-text("${updatedFirstName}")`, { state: "visible" });
			await page.waitForSelector(`tr:has-text("${updatedLastName}")`, { state: "visible" });

			// Validate data updated in form
			const selector = await `tr:has-text("${TEST_TEMPORARY_USER}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const updateBtn = await newUser?.$('button:has-text("Details")');
			await updateBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Update User")', { state: "visible" });

			// Validate form details
			await expect(page.locator("input[name='first_name']")).toHaveValue(updatedFirstName);
			await expect(page.locator("input[name='last_name']")).toHaveValue(updatedLastName);
		});

		test("should succeed on deactivating user", async ({ page }) => {
			await page.click("#active_switch");
			// Click update user button
			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update User")', { state: "hidden" });

			// Validate table shows user as inactive
			await page.waitForSelector(`tr:has-text("${TEST_TEMPORARY_USER}") > td > div > svg.inactive-icon`);
		});

		test("should succeed on activating user", async ({ page }) => {
			await page.click("#active_switch");
			// Click update user button
			await page.click('button >> text="Update"');

			// Wait for modal to be hidden
			await page.waitForSelector('h3:has-text("Update User")', { state: "hidden" });

			// Validate table shows user as inactive
			await page.waitForSelector(`tr:has-text("${TEST_TEMPORARY_USER}") > td > div > svg.active-icon`);
		});
	});

	test.describe("user deletion", () => {
		test("delete user", async ({ page }) => {
			const selector = await `tr:has-text("${TEST_TEMPORARY_USER}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on delete button on the temporary user
			const newUser = await page.$(selector);
			const delBtn = await newUser?.$('button:has-text("Delete")');
			await delBtn?.click();

			// Wait for modal to show
			await page.waitForSelector(selector, { state: "visible" });
			// Delete user
			await page.locator('button[id="delete_button"]').press("Enter");

			// Wait for modal to be hidden
			await page.waitForSelector(selector, { state: "hidden" });

			// Validate user no longer exist
			const tdElement = await page.locator(`td >> text="${TEST_TEMPORARY_USER}"`);
			expect(tdElement).toHaveCount(0);
		});
	});

	test.describe("user assignment", () => {
		test.beforeEach(async ({ page }) => {
			const selector = await `tr:has-text("${TEST_CUSTOMER_REFERRER.email}")`;
			// Wait for selector
			await page.waitForSelector(selector, { state: "visible" });

			// Click on details button on the temporary user
			const newUser = await page.$(selector);
			const assignBtn = await newUser?.$('button:has-text("Assign User")');
			await assignBtn?.click();

			// Wait for modal to show
			await page.waitForSelector('h3:has-text("Assign User")', { state: "visible" });
		});

		test("should have expected labels", async ({ page }) => {
			// Validate customers list hint
			await page.waitForSelector('p:has-text("Customer(s) assigned to user")', { state: "visible" });

			// Validate table headers
			await page.waitForSelector('th:has-text("Name")', { state: "visible" });
			await page.waitForSelector('th:has-text("Email")', { state: "visible" });

			// Validate assign user hint
			await expect(page.locator('p >> text="Please assign the user to a customer"')).toBeVisible();

			// Validate unassigned customers label
			await expect(page.locator('label >> text="Unassigned Customers"')).toBeVisible();
		});

		test("should have default option", async ({ page }) => {
			await expect(page.locator("#customer_id")).toHaveValue("");
		});
	});

	test.describe("user filter", () => {
		test("should not show data when passing sql injection to get all in email field", async ({ page }) => {
			await page.fill('input[name="email"]', "' OR 1=1 --");
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(1)
		});

		test("should not show data when passing sql injection to get all in name field", async ({ page }) => {
			await page.fill('input[name="name"]', "' OR 1=1 --");
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(1)
		});

		test("should allow filtering on email by keyword", async ({ page }) => {
			await page.fill('input[name="email"]', "referred");
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(2)
		});

		test("filter on complete email", async ({ page }) => {
			await page.fill('input[name="email"]', TEST_CUSTOMER_REFERRED.email);
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(2)
		});

		test("should allow filtering on name by keyword and be case insensitive", async ({ page }) => {
			await page.fill('input[name="name"]', "referred");
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(2)
		});

		test("filtering by name should filter both first name and last name", async ({ page }) => {
			// Filter by first name
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.firstName);
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount = await page.$$eval('tr', trs => trs.length);
			await expect(trCount).toBe(2)

			// Filter by last name
			await page.fill('input[name="name"]', TEST_CUSTOMER_REFERRED.lastName);
			await page.click('button >> text="Search"');

			// Validate no data
			const trCount2 = await page.$$eval('tr', trs => trs.length);
			await expect(trCount2).toBe(2)
		});
	});
});
