import { test, expect } from "@playwright/test";
import { expectMobileResponsive, expectNoConsoleErrors } from "../fixtures/test-fixtures";

test.describe("Public Pages", () => {
  test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("should display homepage correctly", async ({ page }) => {
      // Check for hero section
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Check for navigation
      await expect(page.getByRole("navigation")).toBeVisible();

      // Check for CTA buttons
      const ctaButton = page.getByRole("link", { name: /get started|start|begin/i }).first();
      await expect(ctaButton).toBeVisible();
    });

    test("should have working navigation links", async ({ page }) => {
      const navLinks = [
        { name: /services/i, path: "/services" },
        { name: /pricing/i, path: "/pricing" },
        { name: /about/i, path: "/about" },
        { name: /contact/i, path: "/contact" },
      ];

      for (const link of navLinks) {
        const navLink = page.getByRole("link", { name: link.name }).first();
        if (await navLink.isVisible()) {
          await navLink.click();
          await expect(page).toHaveURL(new RegExp(link.path));
          await page.goto("/");
        }
      }
    });

    test("should be mobile responsive", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await expectMobileResponsive(page);
    });

    test("should have no console errors", async ({ page }) => {
      await expectNoConsoleErrors(page);
    });
  });

  test.describe("Services Page", () => {
    test("should display services page correctly", async ({ page }) => {
      await page.goto("/services");

      await expect(page.getByRole("heading", { name: /services/i })).toBeVisible();
      await expect(page.getByText(/business|credit|brand/i).first()).toBeVisible();
    });

    test("should be mobile responsive", async ({ page }) => {
      await page.goto("/services");
      await page.setViewportSize({ width: 375, height: 667 });
      await expectMobileResponsive(page);
    });
  });

  test.describe("About Page", () => {
    test("should display about page correctly", async ({ page }) => {
      await page.goto("/about");

      await expect(page.getByRole("heading", { name: /about|nèko/i })).toBeVisible();
    });

    test("should be mobile responsive", async ({ page }) => {
      await page.goto("/about");
      await page.setViewportSize({ width: 375, height: 667 });
      await expectMobileResponsive(page);
    });
  });

  test.describe("Contact Page", () => {
    test("should display contact form", async ({ page }) => {
      await page.goto("/contact");

      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /submit|send/i })).toBeVisible();
    });

    test("should validate contact form", async ({ page }) => {
      await page.goto("/contact");

      // Try to submit empty form
      await page.getByRole("button", { name: /submit|send/i }).click();

      // Should show validation errors
      const nameInput = page.getByLabel(/name/i);
      const isInvalid = await nameInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid || el.getAttribute("aria-invalid") === "true"
      );
      expect(isInvalid).toBe(true);
    });

    test("should be mobile responsive", async ({ page }) => {
      await page.goto("/contact");
      await page.setViewportSize({ width: 375, height: 667 });
      await expectMobileResponsive(page);
    });
  });

  test.describe("Legal Pages", () => {
    test("should display privacy policy", async ({ page }) => {
      await page.goto("/privacy");

      await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
    });

    test("should display terms of service", async ({ page }) => {
      await page.goto("/terms");

      await expect(page.getByRole("heading", { name: /terms/i })).toBeVisible();
    });
  });

  test.describe("404 Page", () => {
    test("should display 404 for unknown routes", async ({ page }) => {
      await page.goto("/this-page-does-not-exist-12345");

      await expect(page.getByText(/404|not found|page.*exist/i)).toBeVisible();
    });

    test("should have link back to home", async ({ page }) => {
      await page.goto("/this-page-does-not-exist-12345");

      const homeLink = page.getByRole("link", { name: /home|back|return/i });
      await expect(homeLink).toBeVisible();
    });
  });

  test.describe("Navigation Consistency", () => {
    test("should have consistent header across pages", async ({ page }) => {
      const pages = ["/", "/services", "/pricing", "/about", "/contact"];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        await expect(page.getByRole("navigation")).toBeVisible();
      }
    });

    test("should have consistent footer across pages", async ({ page }) => {
      const pages = ["/", "/services", "/pricing", "/about"];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const footer = page.locator("footer");
        await expect(footer).toBeVisible();
      }
    });
  });
});
