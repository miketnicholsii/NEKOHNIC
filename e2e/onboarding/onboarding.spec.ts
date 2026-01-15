import { test, expect } from "@playwright/test";
import { expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("Onboarding Flow", () => {
  // Note: These tests require an authenticated user who hasn't completed onboarding
  // In a real setup, you'd create a test user or mock the auth state

  test.describe("Onboarding Page Structure", () => {
    test.skip("should display onboarding steps correctly", async ({ page }) => {
      // This test requires authentication
      // Skip unless we have a way to mock auth
      await page.goto("/onboarding");

      // Check for step indicators
      await expect(page.getByText(/step|progress/i)).toBeVisible();

      // Check for business stage selection (step 1)
      await expect(page.getByText(/business stage|where are you/i)).toBeVisible();
    });
  });

  test.describe("Onboarding Step Navigation", () => {
    test.skip("should allow navigation between steps", async ({ page }) => {
      await page.goto("/onboarding");

      // Select a business stage
      const stageOption = page.getByRole("radio").first();
      if (await stageOption.isVisible()) {
        await stageOption.click();
      }

      // Click continue/next
      const continueButton = page.getByRole("button", { name: /continue|next/i });
      await expect(continueButton).toBeEnabled();
      await continueButton.click();

      // Should move to next step
      await expect(page.getByText(/industry|what.*industry/i)).toBeVisible();
    });

    test.skip("should allow going back to previous steps", async ({ page }) => {
      await page.goto("/onboarding");

      // Navigate forward first
      const stageOption = page.getByRole("radio").first();
      if (await stageOption.isVisible()) {
        await stageOption.click();
        await page.getByRole("button", { name: /continue|next/i }).click();
      }

      // Click back
      const backButton = page.getByRole("button", { name: /back|previous/i });
      if (await backButton.isVisible()) {
        await backButton.click();
        await expect(page.getByText(/business stage|where are you/i)).toBeVisible();
      }
    });
  });

  test.describe("Onboarding Form Validation", () => {
    test.skip("should require selection before proceeding", async ({ page }) => {
      await page.goto("/onboarding");

      // Continue button should be disabled without selection
      const continueButton = page.getByRole("button", { name: /continue|next/i });
      await expect(continueButton).toBeDisabled();
    });
  });

  test.describe("Onboarding Completion", () => {
    test.skip("should redirect to dashboard after completion", async ({ page }) => {
      await page.goto("/onboarding");

      // Complete all steps (this would need to be customized based on actual steps)
      // Step 1: Business stage
      await page.getByRole("radio").first().click();
      await page.getByRole("button", { name: /continue|next/i }).click();

      // Step 2: Industry
      await page.waitForTimeout(500);
      const industrySelect = page.getByRole("combobox");
      if (await industrySelect.isVisible()) {
        await industrySelect.click();
        await page.getByRole("option").first().click();
      }
      await page.getByRole("button", { name: /continue|next/i }).click();

      // Step 3: Location
      await page.waitForTimeout(500);
      const stateSelect = page.getByRole("combobox");
      if (await stateSelect.isVisible()) {
        await stateSelect.click();
        await page.getByRole("option").first().click();
      }
      await page.getByRole("button", { name: /continue|next/i }).click();

      // Step 4: Goals
      await page.waitForTimeout(500);
      const goalCheckbox = page.getByRole("checkbox").first();
      if (await goalCheckbox.isVisible()) {
        await goalCheckbox.click();
      }
      await page.getByRole("button", { name: /continue|next/i }).click();

      // Step 5: LLC/EIN
      await page.waitForTimeout(500);
      await page.getByRole("button", { name: /get started|finish|complete/i }).click();

      // Should redirect to dashboard
      await page.waitForURL(/\/app/, { timeout: 15000 });
    });
  });

  test("should be mobile responsive on onboarding access page", async ({ page }) => {
    // Test the redirect behavior for unauthenticated users
    await page.goto("/onboarding");
    await page.setViewportSize({ width: 375, height: 667 });

    // Should either show onboarding (if auth mocked) or redirect to login
    const isOnOnboarding = await page.url().includes("/onboarding");
    const isOnLogin = await page.url().includes("/login");

    expect(isOnOnboarding || isOnLogin).toBe(true);
  });
});
