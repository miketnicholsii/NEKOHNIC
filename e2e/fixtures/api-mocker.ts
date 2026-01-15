/**
 * Supabase API Route Interceptor for Playwright
 * 
 * Provides utilities to mock Supabase API calls, enabling
 * E2E testing of authenticated flows without real backend calls.
 */

import { Page, Route } from "@playwright/test";
import {
  createMockUserData,
  createMockResources,
  createMockAnnouncements,
  MockUserData,
} from "./mock-data";
import { TEST_USERS, type TestUserCredentials } from "./test-users";

// Supabase URL pattern to intercept
const SUPABASE_URL_PATTERN = /supabase\.co|supabase\.in/;
const AUTH_ENDPOINTS = /\/auth\/v1\//;
const REST_ENDPOINTS = /\/rest\/v1\//;
const FUNCTIONS_ENDPOINTS = /\/functions\/v1\//;

export interface MockAuthState {
  isAuthenticated: boolean;
  userData: MockUserData | null;
}

/**
 * Creates a Supabase API mocker for a Playwright page
 */
export class SupabaseMocker {
  private page: Page;
  private authState: MockAuthState = { isAuthenticated: false, userData: null };
  private customHandlers: Map<string, (route: Route) => Promise<void>> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Initialize route interception
   */
  async setup(): Promise<void> {
    await this.page.route(SUPABASE_URL_PATTERN, async (route) => {
      const url = route.request().url();

      // Check for custom handler first
      for (const [pattern, handler] of this.customHandlers) {
        if (url.includes(pattern)) {
          return handler(route);
        }
      }

      // Handle auth endpoints
      if (AUTH_ENDPOINTS.test(url)) {
        return this.handleAuthRequest(route);
      }

      // Handle REST endpoints
      if (REST_ENDPOINTS.test(url)) {
        return this.handleRestRequest(route);
      }

      // Handle edge functions
      if (FUNCTIONS_ENDPOINTS.test(url)) {
        return this.handleFunctionRequest(route);
      }

      // Pass through unknown requests
      return route.continue();
    });
  }

  /**
   * Set the mock authentication state
   */
  setAuthState(credentials: TestUserCredentials | null): void {
    if (credentials) {
      this.authState = {
        isAuthenticated: true,
        userData: createMockUserData(credentials),
      };
    } else {
      this.authState = { isAuthenticated: false, userData: null };
    }
  }

  /**
   * Mock a successful login
   */
  async mockLogin(credentials: TestUserCredentials): Promise<void> {
    this.setAuthState(credentials);

    // Also set localStorage to simulate persisted auth
    await this.page.evaluate((session) => {
      localStorage.setItem(
        "sb-jlbkacmbrjqejkdasbsj-auth-token",
        JSON.stringify({
          currentSession: session,
          expiresAt: Date.now() + 3600000,
        })
      );
    }, this.authState.userData?.session);
  }

  /**
   * Mock logout
   */
  async mockLogout(): Promise<void> {
    this.authState = { isAuthenticated: false, userData: null };

    await this.page.evaluate(() => {
      localStorage.removeItem("sb-jlbkacmbrjqejkdasbsj-auth-token");
    });
  }

  /**
   * Add a custom route handler
   */
  addHandler(urlPattern: string, handler: (route: Route) => Promise<void>): void {
    this.customHandlers.set(urlPattern, handler);
  }

  /**
   * Handle authentication requests
   */
  private async handleAuthRequest(route: Route): Promise<void> {
    const url = route.request().url();
    const method = route.request().method();

    // GET /auth/v1/user - Get current user
    if (url.includes("/user") && method === "GET") {
      if (this.authState.isAuthenticated && this.authState.userData) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(this.authState.userData.user),
        });
      }
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "not_authenticated" }),
      });
    }

    // POST /auth/v1/token - Login
    if (url.includes("/token") && method === "POST") {
      try {
        const body = await route.request().postDataJSON();
        const email = body?.email;
        const password = body?.password;

        // Find matching test user
        const testUser = Object.values(TEST_USERS).find(
          (u) => u.email === email && u.password === password
        );

        if (testUser) {
          this.setAuthState(testUser);
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              access_token: this.authState.userData!.session.access_token,
              refresh_token: this.authState.userData!.session.refresh_token,
              expires_in: 3600,
              expires_at: this.authState.userData!.session.expires_at,
              user: this.authState.userData!.user,
            }),
          });
        }

        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "invalid_credentials", error_description: "Invalid login credentials" }),
        });
      } catch {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "invalid_request" }),
        });
      }
    }

    // POST /auth/v1/signup - Register
    if (url.includes("/signup") && method === "POST") {
      try {
        const body = await route.request().postDataJSON();
        const mockUser = createMockUserData({
          email: body?.email || "new@example.com",
          password: body?.password || "Password123!",
          tier: "free",
          isAdmin: false,
          onboardingCompleted: false,
          displayName: body?.options?.data?.full_name || "New User",
        });

        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            access_token: mockUser.session.access_token,
            refresh_token: mockUser.session.refresh_token,
            user: mockUser.user,
          }),
        });
      } catch {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "signup_failed" }),
        });
      }
    }

    // POST /auth/v1/logout - Logout
    if (url.includes("/logout") && method === "POST") {
      this.authState = { isAuthenticated: false, userData: null };
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    }

    // POST /auth/v1/recover - Password reset
    if (url.includes("/recover") && method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    }

    // Default: pass through
    return route.continue();
  }

  /**
   * Handle REST API requests (database queries)
   */
  private async handleRestRequest(route: Route): Promise<void> {
    const url = route.request().url();
    const method = route.request().method();
    const userData = this.authState.userData;

    // Parse table name from URL
    const tableMatch = url.match(/\/rest\/v1\/([^?]+)/);
    const tableName = tableMatch?.[1];

    // Check authentication for protected tables
    const publicTables = ["resources", "announcements"];
    if (!publicTables.includes(tableName || "") && !this.authState.isAuthenticated) {
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "not_authenticated" }),
      });
    }

    // Handle specific tables
    switch (tableName) {
      case "profiles":
        return this.handleProfilesTable(route, method, userData);

      case "subscriptions":
        return this.handleSubscriptionsTable(route, method, userData);

      case "user_roles":
        return this.handleUserRolesTable(route, method, userData);

      case "progress":
        return this.handleProgressTable(route, method, userData);

      case "user_tasks":
        return this.handleTasksTable(route, method, userData);

      case "user_streaks":
        return this.handleStreaksTable(route, method, userData);

      case "user_achievements":
        return this.handleAchievementsTable(route, method, userData);

      case "resources":
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(createMockResources()),
        });

      case "announcements":
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(createMockAnnouncements()),
        });

      default:
        // Return empty array for unknown tables
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
    }
  }

  private async handleProfilesTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([userData.profile]),
      });
    }
    if (method === "PATCH" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([userData.profile]),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleSubscriptionsTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([userData.subscription]),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleUserRolesTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(userData.roles),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleProgressTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(userData.progress),
      });
    }
    if ((method === "POST" || method === "PATCH") && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ ...userData.progress[0], completed: true }]),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleTasksTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(userData.tasks),
      });
    }
    if (method === "POST" && userData) {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify([{ id: `task-${Date.now()}`, user_id: userData.user.id }]),
      });
    }
    if (method === "PATCH" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([userData.tasks[0]]),
      });
    }
    if (method === "DELETE") {
      return route.fulfill({ status: 204, body: "" });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleStreaksTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([userData.streak]),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  private async handleAchievementsTable(route: Route, method: string, userData: MockUserData | null): Promise<void> {
    if (method === "GET" && userData) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(userData.achievements),
      });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  }

  /**
   * Handle edge function requests
   */
  private async handleFunctionRequest(route: Route): Promise<void> {
    const url = route.request().url();

    // check-subscription
    if (url.includes("/check-subscription")) {
      if (this.authState.isAuthenticated && this.authState.userData) {
        const sub = this.authState.userData.subscription;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            subscribed: sub.plan !== "free",
            tier: sub.plan,
            subscription_end: sub.current_period_end,
            cancel_at_period_end: sub.cancel_at_period_end,
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          subscribed: false,
          tier: "free",
          subscription_end: null,
          cancel_at_period_end: false,
        }),
      });
    }

    // check-addons
    if (url.includes("/check-addons")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ addons: [] }),
      });
    }

    // create-checkout
    if (url.includes("/create-checkout")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://checkout.stripe.com/mock-session" }),
      });
    }

    // customer-portal
    if (url.includes("/customer-portal")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://billing.stripe.com/mock-portal" }),
      });
    }

    // Default: pass through
    return route.continue();
  }
}

/**
 * Create and setup a Supabase mocker for a page
 */
export async function setupSupabaseMock(page: Page): Promise<SupabaseMocker> {
  const mocker = new SupabaseMocker(page);
  await mocker.setup();
  return mocker;
}

/**
 * Helper to create an authenticated page with mocked API
 */
export async function createMockedAuthPage(
  page: Page,
  credentials: TestUserCredentials
): Promise<SupabaseMocker> {
  const mocker = await setupSupabaseMock(page);
  await mocker.mockLogin(credentials);
  return mocker;
}
