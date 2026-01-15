import { test, expect } from "@playwright/test";
import { expectNoConsoleErrors, expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("Signup Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("should display signup page correctly", async ({ page }) => {
    // Verify page elements
    await expect(page.getByRole("heading", { name: /create.*account|sign up|join/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign up|create|register/i })).toBeVisible();

    // Verify link to login
    await expect(page.getByRole("link", { name: /log in|sign in/i })).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: /sign up|create|register/i }).click();

    // Should show validation errors (either native or custom)
    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid || el.getAttribute("aria-invalid") === "true"
    );
    expect(isInvalid).toBe(true);
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/password/i).first().fill("Password123!");
    
    // Look for confirm password if it exists
    const confirmPassword = page.getByLabel(/confirm password/i);
    if (await confirmPassword.isVisible()) {
      await confirmPassword.fill("Password123!");
    }

    await page.getByRole("button", { name: /sign up|create|register/i }).click();

    // Should show email validation error
    await expect(page.getByText(/valid email|invalid email/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show error for weak password", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).first().fill("123"); // Too weak

    await page.getByRole("button", { name: /sign up|create|register/i }).click();

    // Should show password strength error
    const errorVisible = await page
      .getByText(/password.*characters|password.*weak|password.*short/i)
      .isVisible()
      .catch(() => false);

    // If no error shown, check for native validation
    if (!errorVisible) {
      const passwordInput = page.getByLabel(/password/i).first();
      const isInvalid = await passwordInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );
      expect(isInvalid).toBe(true);
    }
  });

  test("should show error for password mismatch", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).first().fill("Password123!");

    const confirmPassword = page.getByLabel(/confirm password/i);
    if (await confirmPassword.isVisible()) {
      await confirmPassword.fill("DifferentPassword!");
      await page.getByRole("button", { name: /sign up|create|register/i }).click();

      // Should show password mismatch error
      await expect(page.getByText(/password.*match|passwords.*match/i)).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("should navigate to login page", async ({ page }) => {
    await page.getByRole("link", { name: /log in|sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expectMobileResponsive(page);
    await expect(page.getByRole("button", { name: /sign up|create|register/i })).toBeVisible();
  });

  test("should have no console errors", async ({ page }) => {
    await expectNoConsoleErrors(page);
  });
});
