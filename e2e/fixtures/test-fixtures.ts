import { test as base, expect, Page } from "@playwright/test";

/**
 * Test user credentials for E2E tests
 * In CI, these should be configured via environment variables
 */
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || "test@example.com",
  password: process.env.TEST_USER_PASSWORD || "TestPassword123!",
  name: "Test User",
};

/**
 * Extended test fixture with common utilities
 */
export const test = base.extend<{
  loginPage: Page;
  authenticatedPage: Page;
}>({
  loginPage: async ({ page }, use) => {
    await page.goto("/login");
    await use(page);
  },

  authenticatedPage: async ({ page }, use) => {
    // This would require a real test user in the database
    // For now, we mock the auth state or use a test account
    await page.goto("/login");

    // Fill login form
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for navigation to dashboard or onboarding
    await page.waitForURL(/\/(app|onboarding)/);

    await use(page);
  },
});

export { expect };

/**
 * Helper to check for no console errors during test
 */
export async function expectNoConsoleErrors(page: Page): Promise<void> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  // Give time for any errors to appear
  await page.waitForTimeout(500);

  // Filter out known acceptable errors (e.g., network errors in test env)
  const criticalErrors = errors.filter(
    (e) =>
      !e.includes("Failed to load resource") &&
      !e.includes("net::ERR_") &&
      !e.includes("favicon")
  );

  expect(criticalErrors).toHaveLength(0);
}

/**
 * Helper to verify mobile responsiveness
 */
export async function expectMobileResponsive(page: Page): Promise<void> {
  // Check no horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(hasHorizontalScroll).toBe(false);

  // Check all interactive elements have adequate tap targets
  const smallTapTargets = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"]'
    );
    const small: string[] = [];

    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (rect.width < 44 || rect.height < 44) {
          small.push(`${el.tagName}: ${rect.width}x${rect.height}`);
        }
      }
    });

    return small;
  });

  // Log warnings for small tap targets (not a hard fail)
  if (smallTapTargets.length > 0) {
    console.warn("Small tap targets found:", smallTapTargets.slice(0, 5));
  }
}
