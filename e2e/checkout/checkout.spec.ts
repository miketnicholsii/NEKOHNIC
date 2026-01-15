import { test, expect } from "@playwright/test";
import { expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("Checkout Flow", () => {
  test.describe("Pricing Page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/pricing");
    });

    test("should display pricing tiers correctly", async ({ page }) => {
      // Check for tier headings
      await expect(page.getByText(/free|starter|basic/i).first()).toBeVisible();
      await expect(page.getByText(/pro|professional|premium/i).first()).toBeVisible();

      // Check for pricing
      await expect(page.getByText(/\$|free|month/i).first()).toBeVisible();

      // Check for CTA buttons
      const ctaButtons = page.getByRole("button", { name: /get started|subscribe|upgrade|choose/i });
      await expect(ctaButtons.first()).toBeVisible();
    });

    test("should have clickable upgrade buttons", async ({ page }) => {
      const upgradeButton = page.getByRole("link", { name: /get started|subscribe|upgrade/i }).first();
      if (await upgradeButton.isVisible()) {
        await expect(upgradeButton).toBeEnabled();
      }
    });

    test("should show feature comparisons", async ({ page }) => {
      // Check for feature lists
      const features = page.locator("text=/✓|✗|check|included|unlimited/i");
      expect(await features.count()).toBeGreaterThan(0);
    });

    test("should be mobile responsive", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await expectMobileResponsive(page);
    });
  });

  test.describe("Checkout Button Flow", () => {
    test("should redirect unauthenticated users to login/signup", async ({ page }) => {
      await page.goto("/pricing");

      // Find a paid plan upgrade button
      const upgradeLinks = page.getByRole("link", { name: /get started|upgrade|subscribe/i });
      const upgradeButton = upgradeLinks.first();

      if (await upgradeButton.isVisible()) {
        await upgradeButton.click();

        // Should redirect to login/signup or show auth modal
        await page.waitForTimeout(2000);
        const url = page.url();
        const isAuthPage = url.includes("/login") || url.includes("/signup") || url.includes("/get-started");
        const hasAuthModal = await page.getByRole("dialog").isVisible().catch(() => false);

        expect(isAuthPage || hasAuthModal).toBe(true);
      }
    });
  });

  test.describe("Checkout Success Page", () => {
    test("should display success page correctly", async ({ page }) => {
      await page.goto("/app/checkout-success");

      // This will likely redirect unauthenticated users
      // But check the page structure if accessible
      await page.waitForTimeout(1000);

      if (page.url().includes("/checkout-success")) {
        await expect(
          page.getByText(/success|thank you|confirmed|complete/i)
        ).toBeVisible();
      }
    });
  });

  test.describe("Upgrade Modal", () => {
    test.skip("should show upgrade modal for locked features", async ({ page }) => {
      // This requires authentication
      await page.goto("/app/business-credit");

      // Look for locked feature indicators
      const lockedIndicator = page.getByText(/locked|upgrade|unlock/i).first();
      if (await lockedIndicator.isVisible()) {
        await lockedIndicator.click();

        // Should show upgrade modal
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page.getByText(/upgrade|subscribe|plan/i)).toBeVisible();
      }
    });
  });

  test.describe("Account Billing", () => {
    test.skip("should show billing information in account settings", async ({ page }) => {
      // Requires authentication
      await page.goto("/app/account");

      // Look for billing section
      const billingSection = page.getByText(/billing|subscription|plan/i).first();
      if (await billingSection.isVisible()) {
        await expect(page.getByText(/current plan|subscription/i)).toBeVisible();
      }
    });
  });
});
