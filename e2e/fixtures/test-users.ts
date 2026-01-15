/**
 * Test User Credentials for E2E Testing
 * 
 * These credentials match the users created by the seed-test-data edge function.
 * Use these in your Playwright tests for authenticated flow testing.
 * 
 * IMPORTANT: These are test accounts only. Never use real credentials.
 */

export interface TestUserCredentials {
  email: string;
  password: string;
  tier: "free" | "start" | "build" | "scale";
  isAdmin: boolean;
  onboardingCompleted: boolean;
  displayName: string;
}

/**
 * All available test users
 */
export const TEST_USERS: Record<string, TestUserCredentials> = {
  free: {
    email: "test-free@neko-test.local",
    password: "TestPassword123!",
    tier: "free",
    isAdmin: false,
    onboardingCompleted: true,
    displayName: "Test Free User",
  },
  starter: {
    email: "test-starter@neko-test.local",
    password: "TestPassword123!",
    tier: "start",
    isAdmin: false,
    onboardingCompleted: true,
    displayName: "Test Starter User",
  },
  pro: {
    email: "test-pro@neko-test.local",
    password: "TestPassword123!",
    tier: "build",
    isAdmin: false,
    onboardingCompleted: true,
    displayName: "Test Pro User",
  },
  elite: {
    email: "test-elite@neko-test.local",
    password: "TestPassword123!",
    tier: "scale",
    isAdmin: false,
    onboardingCompleted: true,
    displayName: "Test Elite User",
  },
  newUser: {
    email: "test-new@neko-test.local",
    password: "TestPassword123!",
    tier: "free",
    isAdmin: false,
    onboardingCompleted: false,
    displayName: "Test New User",
  },
  admin: {
    email: "test-admin@neko-test.local",
    password: "TestPassword123!",
    tier: "scale",
    isAdmin: true,
    onboardingCompleted: true,
    displayName: "Test Admin User",
  },
};

/**
 * Get test user by tier
 */
export function getTestUserByTier(tier: "free" | "start" | "build" | "scale"): TestUserCredentials {
  const tierMap: Record<string, string> = {
    free: "free",
    start: "starter",
    build: "pro",
    scale: "elite",
  };
  return TEST_USERS[tierMap[tier]];
}

/**
 * Get test user that needs onboarding
 */
export function getNewTestUser(): TestUserCredentials {
  return TEST_USERS.newUser;
}

/**
 * Get admin test user
 */
export function getAdminTestUser(): TestUserCredentials {
  return TEST_USERS.admin;
}

/**
 * Default test user (free tier, onboarded)
 */
export const DEFAULT_TEST_USER = TEST_USERS.free;

/**
 * Environment variable overrides
 * If TEST_USER_EMAIL and TEST_USER_PASSWORD are set, use those instead
 */
export function getEnvTestUser(): TestUserCredentials {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (email && password) {
    // Find matching test user or create custom one
    const matchingUser = Object.values(TEST_USERS).find(u => u.email === email);
    if (matchingUser) {
      return { ...matchingUser, password };
    }

    // Return custom user
    return {
      email,
      password,
      tier: "free",
      isAdmin: false,
      onboardingCompleted: true,
      displayName: "Custom Test User",
    };
  }

  return DEFAULT_TEST_USER;
}
