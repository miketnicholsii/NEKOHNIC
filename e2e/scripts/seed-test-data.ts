/**
 * Test Data Seeding Script for E2E Tests
 * 
 * This script calls the seed-test-data edge function to create
 * consistent test users for authenticated E2E testing.
 * 
 * Usage:
 *   npx ts-node e2e/scripts/seed-test-data.ts seed
 *   npx ts-node e2e/scripts/seed-test-data.ts cleanup
 * 
 * Environment variables required:
 *   SUPABASE_URL - The Supabase project URL
 *   SEED_SECRET_KEY - The secret key for seeding
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SEED_SECRET_KEY = process.env.SEED_SECRET_KEY;

interface SeedResult {
  success: boolean;
  message: string;
  results: Array<{ email: string; status: string; error?: string }>;
  test_users?: Array<{
    email: string;
    password: string;
    tier: string;
    is_admin: boolean;
    onboarding_completed: boolean;
  }>;
}

async function seedTestData(action: "seed" | "cleanup"): Promise<void> {
  if (!SUPABASE_URL) {
    console.error("❌ SUPABASE_URL environment variable is required");
    process.exit(1);
  }

  if (!SEED_SECRET_KEY) {
    console.error("❌ SEED_SECRET_KEY environment variable is required");
    console.log("   Set SEED_SECRET_KEY in your environment or .env.local file");
    process.exit(1);
  }

  const functionUrl = `${SUPABASE_URL}/functions/v1/seed-test-data`;

  console.log(`\n🌱 ${action === "seed" ? "Seeding" : "Cleaning up"} test data...`);
  console.log(`   URL: ${functionUrl}\n`);

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        seed_key: SEED_SECRET_KEY,
      }),
    });

    const data: SeedResult = await response.json();

    if (!response.ok) {
      console.error(`❌ Error: ${data.message || "Unknown error"}`);
      process.exit(1);
    }

    console.log(`✅ ${data.message}\n`);

    // Print results table
    console.log("Results:");
    console.log("─".repeat(50));
    for (const result of data.results) {
      const statusIcon = result.status === "error" ? "❌" : result.status === "created" ? "✅" : "⏭️";
      console.log(`${statusIcon} ${result.email}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log("─".repeat(50));

    // Print test user credentials if seeding
    if (action === "seed" && data.test_users) {
      console.log("\n📋 Test User Credentials:");
      console.log("─".repeat(70));
      console.log("| Email                          | Password          | Tier    | Admin |");
      console.log("─".repeat(70));
      for (const user of data.test_users) {
        const email = user.email.padEnd(30);
        const password = user.password.padEnd(17);
        const tier = user.tier.padEnd(7);
        const admin = user.is_admin ? "Yes" : "No";
        console.log(`| ${email} | ${password} | ${tier} | ${admin.padEnd(5)} |`);
      }
      console.log("─".repeat(70));

      console.log("\n💡 Usage in Playwright tests:");
      console.log('   Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables');
      console.log('   Or use the test users directly in your test fixtures');
    }

  } catch (error) {
    console.error(`❌ Network error: ${error}`);
    process.exit(1);
  }
}

// Parse command line arguments
const action = process.argv[2] as "seed" | "cleanup";

if (!action || !["seed", "cleanup"].includes(action)) {
  console.log(`
Test Data Seeding Script
─────────────────────────

Usage:
  npx ts-node e2e/scripts/seed-test-data.ts <action>

Actions:
  seed     Create test users and sample data
  cleanup  Remove all test users and their data

Environment Variables:
  SUPABASE_URL      The Supabase project URL
  SEED_SECRET_KEY   Secret key for authentication

Example:
  SEED_SECRET_KEY=my-secret npx ts-node e2e/scripts/seed-test-data.ts seed
`);
  process.exit(1);
}

seedTestData(action);
