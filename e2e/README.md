# E2E Tests

This directory contains end-to-end tests for critical user flows using [Playwright](https://playwright.dev/).

## Test Modes

### 1. Mocked Tests (Recommended for CI)
Tests that use API mocking to simulate backend responses. These are fast, reliable, and don't require backend setup.

```bash
npx playwright test e2e/mocked/
```

### 2. Real Backend Tests
Tests that run against the actual backend. Require seeded test users.

```bash
npx playwright test e2e/auth/ e2e/dashboard/
```

## Test Structure

```
e2e/
├── fixtures/
│   ├── test-fixtures.ts    # Shared test utilities
│   ├── test-users.ts       # Test user credentials
│   ├── mock-data.ts        # Mock data factories
│   └── api-mocker.ts       # Supabase API interceptor
├── mocked/
│   └── mocked-flows.spec.ts # Tests using API mocking
├── auth/
│   ├── signup.spec.ts      # User registration tests
│   ├── login.spec.ts       # User login tests
│   └── forgot-password.spec.ts
├── onboarding/
│   └── onboarding.spec.ts  # New user onboarding flow
├── checkout/
│   └── checkout.spec.ts    # Pricing and subscription tests
├── dashboard/
│   └── navigation.spec.ts  # Dashboard navigation tests
├── public/
│   └── public-pages.spec.ts # Public page tests
└── scripts/
    └── seed-test-data.ts   # Test data seeding script
```

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test e2e/auth/login.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests for Mobile

```bash
npx playwright test --project=mobile-chrome
```

## Test Data Seeding

Before running authenticated tests, seed the test database with consistent test users:

### Prerequisites

1. Set the `SEED_SECRET_KEY` secret in your backend (Settings → Secrets)
2. Set `ALLOW_TEST_SEEDING=true` secret to enable seeding

### Seed Test Users

```bash
# Using the edge function directly
curl -X POST "${SUPABASE_URL}/functions/v1/seed-test-data" \
  -H "Content-Type: application/json" \
  -d '{"action": "seed", "seed_key": "your-secret-key"}'

# Or using the TypeScript script
SEED_SECRET_KEY=your-secret npx ts-node e2e/scripts/seed-test-data.ts seed
```

### Cleanup Test Users

```bash
SEED_SECRET_KEY=your-secret npx ts-node e2e/scripts/seed-test-data.ts cleanup
```

### Available Test Users

| Email | Tier | Admin | Onboarded |
|-------|------|-------|-----------|
| test-free@neko-test.local | Free | No | Yes |
| test-starter@neko-test.local | Starter | No | Yes |
| test-pro@neko-test.local | Pro | No | Yes |
| test-elite@neko-test.local | Elite | No | Yes |
| test-new@neko-test.local | Free | No | No |
| test-admin@neko-test.local | Elite | Yes | Yes |

All test users use password: `TestPassword123!`

## Test Categories

### 1. Authentication Tests (`e2e/auth/`)

- **signup.spec.ts**: Tests user registration flow
  - Form validation (email, password, confirmation)
  - Error handling for invalid inputs
  - Mobile responsiveness
  - Navigation to login

- **login.spec.ts**: Tests user login flow
  - Form validation
  - Invalid credentials handling
  - Password visibility toggle
  - Remember me functionality
  - OAuth buttons
  - Navigation to signup/forgot password

- **forgot-password.spec.ts**: Tests password reset flow
  - Email validation
  - Success message display
  - Navigation back to login

### 2. Onboarding Tests (`e2e/onboarding/`)

- Step navigation (forward/backward)
- Form validation per step
- Completion and redirect to dashboard
- Mobile responsiveness

### 3. Checkout Tests (`e2e/checkout/`)

- Pricing page display
- Tier comparisons
- Upgrade button functionality
- Authentication requirements for checkout
- Success page display

### 4. Dashboard Tests (`e2e/dashboard/`)

- Protected route redirects
- Sidebar navigation
- Mobile hamburger menu
- Widget display
- Logout functionality

### 5. Public Page Tests (`e2e/public/`)

- Homepage display and navigation
- Services, About, Contact pages
- Legal pages (Privacy, Terms)
- 404 error page
- Header/footer consistency

## Configuration

Tests are configured in `playwright.config.ts`:

- **baseURL**: `http://localhost:8080` (or `BASE_URL` env var)
- **Projects**: Desktop Chrome, Mobile Chrome
- **Retries**: 2 in CI, 0 locally
- **Artifacts**: Screenshots on failure, traces on retry

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Base URL for tests | `http://localhost:8080` |
| `TEST_USER_EMAIL` | Test user email for auth tests | `test@example.com` |
| `TEST_USER_PASSWORD` | Test user password | `TestPassword123!` |

## CI Integration

Tests run automatically in GitHub Actions:

1. After lint/typecheck and build pass
2. Using Chromium browser
3. Results uploaded as artifacts
4. 30-minute timeout

## Writing New Tests

1. Create test file in appropriate directory
2. Import fixtures from `../fixtures/test-fixtures.ts`
3. Use `test.skip()` for tests requiring authentication
4. Add mobile responsiveness checks with `expectMobileResponsive()`
5. Check for console errors with `expectNoConsoleErrors()`

Example:

```typescript
import { test, expect } from "@playwright/test";
import { expectMobileResponsive } from "../fixtures/test-fixtures";

test.describe("My Feature", () => {
  test("should work correctly", async ({ page }) => {
    await page.goto("/my-page");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/my-page");
    await expectMobileResponsive(page);
  });
});
```

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is starting correctly
- Verify selectors are correct

### Tests failing in CI only
- Check environment variables are set
- Verify browser installation step
- Review CI logs for specific errors

### Flaky tests
- Add appropriate waits (`waitForURL`, `waitForSelector`)
- Use more specific selectors
- Increase retry count for specific tests
