import { test, expect } from "@playwright/test";
import { TEST_USER, expectNoConsoleErrors, expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login page correctly", async ({ page }) => {
    // Verify page elements
    await expect(page.getByRole("heading", { name: /welcome|sign in|log in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();

    // Verify links
    await expect(page.getByRole("link", { name: /sign up|create.*account|register/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /forgot.*password/i })).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Should show validation errors
    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid || el.getAttribute("aria-invalid") === "true"
    );
    expect(isInvalid).toBe(true);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.getByLabel(/email/i).fill("nonexistent@example.com");
    await page.getByLabel(/password/i).fill("WrongPassword123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Should show error toast or message
    await expect(
      page.getByText(/invalid|incorrect|wrong|not found|credentials/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.getByLabel(/email/i).fill("not-an-email");
    await page.getByLabel(/password/i).fill("Password123!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Should show email validation error
    const hasError = await page
      .getByText(/valid email|invalid email/i)
      .isVisible()
      .catch(() => false);

    if (!hasError) {
      const emailInput = page.getByLabel(/email/i);
      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );
      expect(isInvalid).toBe(true);
    }
  });

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill("TestPassword123!");

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Find and click the visibility toggle
    const toggleButton = page.getByRole("button", { name: /show|hide|toggle.*password/i });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute("type", "text");

      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  test("should have remember me checkbox", async ({ page }) => {
    const rememberMe = page.getByLabel(/remember me/i);
    if (await rememberMe.isVisible()) {
      await expect(rememberMe).not.toBeChecked();
      await rememberMe.click();
      await expect(rememberMe).toBeChecked();
    }
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.getByRole("link", { name: /sign up|create.*account|register/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.getByRole("link", { name: /forgot.*password/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("should have Google OAuth button", async ({ page }) => {
    const googleButton = page.getByRole("button", { name: /google|continue with google/i });
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeEnabled();
    }
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expectMobileResponsive(page);
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("should have no console errors", async ({ page }) => {
    await expectNoConsoleErrors(page);
  });
});

test.describe("Login Success Flow", () => {
  test.skip("should redirect to dashboard after successful login", async ({ page }) => {
    // This test requires a real test user in the database
    // Skip in CI unless TEST_USER_EMAIL is configured
    if (!process.env.TEST_USER_EMAIL) {
      test.skip();
    }

    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Should redirect to app or onboarding
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15000 });
  });
});
