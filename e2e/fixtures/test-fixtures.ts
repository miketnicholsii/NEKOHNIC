import { test as base, expect, Page } from "@playwright/test";
import { 
  TEST_USERS, 
  getEnvTestUser, 
  getTestUserByTier,
  getAdminTestUser,
  getNewTestUser,
  type TestUserCredentials 
} from "./test-users";

/**
 * Re-export test users for convenience
 */
export { TEST_USERS, getEnvTestUser, getTestUserByTier, getAdminTestUser, getNewTestUser };
export type { TestUserCredentials };

/**
 * Legacy TEST_USER export for backward compatibility
 */
export const TEST_USER = getEnvTestUser();

/**
 * Extended test fixture with authentication utilities
 */
export const test = base.extend<{
  loginPage: Page;
  authenticatedPage: Page;
  freeUserPage: Page;
  proUserPage: Page;
  adminPage: Page;
}>({
  loginPage: async ({ page }, runFixture) => {
    await page.goto("/login");
    await runFixture(page);
  },

  /**
   * Page authenticated with default test user (from env or free tier)
   */
  authenticatedPage: async ({ page }, runFixture) => {
    await loginAsUser(page, getEnvTestUser());
    await runFixture(page);
  },

  /**
   * Page authenticated with free tier user
   */
  freeUserPage: async ({ page }, runFixture) => {
    await loginAsUser(page, TEST_USERS.free);
    await runFixture(page);
  },

  /**
   * Page authenticated with pro tier user
   */
  proUserPage: async ({ page }, runFixture) => {
    await loginAsUser(page, TEST_USERS.pro);
    await runFixture(page);
  },

  /**
   * Page authenticated with admin user
   */
  adminPage: async ({ page }, runFixture) => {
    await loginAsUser(page, TEST_USERS.admin);
    await runFixture(page);
  },
});

/**
 * Helper function to log in as a specific user
 */
export async function loginAsUser(page: Page, user: TestUserCredentials): Promise<void> {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for navigation - either to app (onboarded) or onboarding (new user)
  if (user.onboardingCompleted) {
    await page.waitForURL(/\/app/, { timeout: 15000 });
  } else {
    await page.waitForURL(/\/onboarding/, { timeout: 15000 });
  }
}

/**
 * Helper to check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check for presence of logout button or user menu
  const hasLogout = await page.getByRole("button", { name: /log.*out|sign.*out/i }).isVisible().catch(() => false);
  const hasUserMenu = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);
  const isOnApp = page.url().includes("/app");
  
  return hasLogout || hasUserMenu || isOnApp;
}

/**
 * Helper to log out current user
 */
export async function logout(page: Page): Promise<void> {
  const logoutButton = page.getByRole("button", { name: /log.*out|sign.*out/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/^\/(login)?$/, { timeout: 10000 });
  }
}

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
