import { test, expect } from "@playwright/test";
import { expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("Forgot Password Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("should display forgot password page correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /forgot|reset|password/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /reset|send|submit/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back|login|sign in/i })).toBeVisible();
  });

  test("should show validation error for empty email", async ({ page }) => {
    await page.getByRole("button", { name: /reset|send|submit/i }).click();

    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid || el.getAttribute("aria-invalid") === "true"
    );
    expect(isInvalid).toBe(true);
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByRole("button", { name: /reset|send|submit/i }).click();

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

  test("should show success message for valid email", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByRole("button", { name: /reset|send|submit/i }).click();

    // Should show success message (even for non-existent emails for security)
    await expect(
      page.getByText(/sent|check.*email|instructions|reset link/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("should navigate back to login", async ({ page }) => {
    await page.getByRole("link", { name: /back|login|sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expectMobileResponsive(page);
  });
});
