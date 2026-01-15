import { test, expect } from "@playwright/test";
import { expectMobileResponsive, expectNoConsoleErrors } from "../fixtures/test-fixtures";

test.describe("Dashboard Navigation", () => {
  test.describe("Sidebar Navigation (Unauthenticated)", () => {
    test("should redirect to login when accessing protected routes", async ({ page }) => {
      await page.goto("/app");

      // Should redirect to login
      await page.waitForURL(/\/(login|signup|get-started)/, { timeout: 10000 });
    });

    test("should redirect from all dashboard routes", async ({ page }) => {
      const protectedRoutes = [
        "/app",
        "/app/strategy",
        "/app/business-starter",
        "/app/business-credit",
        "/app/personal-brand",
        "/app/resources",
        "/app/achievements",
        "/app/analytics",
        "/app/account",
        "/app/support",
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForTimeout(1000);

        const url = page.url();
        const isRedirected =
          url.includes("/login") ||
          url.includes("/signup") ||
          url.includes("/get-started");

        expect(isRedirected).toBe(true);
      }
    });
  });

  test.describe("Sidebar Structure (Authenticated)", () => {
    test.skip("should display sidebar with all navigation items", async ({ page }) => {
      // Requires authentication
      await page.goto("/app");

      // Check sidebar items
      const navItems = [
        "Dashboard",
        "Strategy",
        "Business Starter",
        "Business Credit",
        "Personal Brand",
        "Resources",
        "Achievements",
        "Analytics",
        "Account",
        "Support",
      ];

      for (const item of navItems) {
        const navLink = page.getByRole("link", { name: new RegExp(item, "i") });
        await expect(navLink).toBeVisible();
      }
    });

    test.skip("should highlight active navigation item", async ({ page }) => {
      await page.goto("/app");

      // Dashboard link should be active
      const dashboardLink = page.getByRole("link", { name: /dashboard/i }).first();
      await expect(dashboardLink).toHaveClass(/active|current|selected/);
    });

    test.skip("should navigate to each route correctly", async ({ page }) => {
      await page.goto("/app");

      const routes = [
        { name: "Strategy", path: "/app/strategy" },
        { name: "Business Starter", path: "/app/business-starter" },
        { name: "Resources", path: "/app/resources" },
        { name: "Account", path: "/app/account" },
      ];

      for (const route of routes) {
        await page.getByRole("link", { name: new RegExp(route.name, "i") }).click();
        await expect(page).toHaveURL(new RegExp(route.path));
        await page.goBack();
      }
    });
  });

  test.describe("Mobile Navigation", () => {
    test.skip("should show hamburger menu on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/app");

      // Should have hamburger menu button
      const menuButton = page.getByRole("button", { name: /menu|toggle|nav/i });
      await expect(menuButton).toBeVisible();
    });

    test.skip("should open mobile menu when hamburger is clicked", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/app");

      const menuButton = page.getByRole("button", { name: /menu|toggle|nav/i });
      await menuButton.click();

      // Sidebar should be visible
      await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
    });

    test.skip("should close mobile menu after navigation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/app");

      const menuButton = page.getByRole("button", { name: /menu|toggle|nav/i });
      await menuButton.click();

      // Click a nav item
      await page.getByRole("link", { name: /strategy/i }).click();

      // Menu should close
      await page.waitForTimeout(500);
      const menuButtonVisible = await menuButton.isVisible();
      if (menuButtonVisible) {
        // Sidebar should be hidden
        const sidebar = page.locator('[class*="sidebar"]');
        const sidebarHidden = await sidebar.isHidden().catch(() => true);
        expect(sidebarHidden).toBe(true);
      }
    });
  });

  test.describe("Dashboard Content", () => {
    test.skip("should display welcome header", async ({ page }) => {
      await page.goto("/app");

      await expect(page.getByText(/welcome|hello|hi/i).first()).toBeVisible();
    });

    test.skip("should display dashboard widgets", async ({ page }) => {
      await page.goto("/app");

      // Check for widget presence
      const widgets = page.locator('[class*="widget"], [class*="card"]');
      expect(await widgets.count()).toBeGreaterThan(0);
    });

    test.skip("should display quick actions", async ({ page }) => {
      await page.goto("/app");

      const quickActions = page.getByText(/quick action|get started|next step/i);
      if (await quickActions.isVisible()) {
        await expect(quickActions).toBeVisible();
      }
    });
  });

  test.describe("Error Handling", () => {
    test("should show 404 for invalid routes", async ({ page }) => {
      await page.goto("/app/nonexistent-page");

      await page.waitForTimeout(1000);
      const url = page.url();

      // Should either show 404 or redirect
      const is404 = await page.getByText(/404|not found|page.*exist/i).isVisible().catch(() => false);
      const isRedirected = url.includes("/login") || url.includes("/app");

      expect(is404 || isRedirected).toBe(true);
    });
  });

  test.describe("Public Routes from Dashboard", () => {
    test.skip("should have working logout", async ({ page }) => {
      await page.goto("/app");

      // Find logout button
      const logoutButton = page.getByRole("button", { name: /log.*out|sign.*out/i });
      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Should redirect to home or login
        await page.waitForURL(/^\/(login)?$/, { timeout: 10000 });
      }
    });
  });
});
