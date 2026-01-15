import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Test Data Seeding Edge Function
 * 
 * Creates consistent test users and data for E2E testing.
 * SECURITY: Only works when ALLOW_TEST_SEEDING secret is set to "true"
 * 
 * Usage: POST /seed-test-data with JSON body:
 * {
 *   "action": "seed" | "cleanup",
 *   "seed_key": "<SEED_SECRET_KEY>"
 * }
 */

interface TestUser {
  email: string;
  password: string;
  full_name: string;
  tier: "free" | "start" | "build" | "scale";
  onboarding_completed: boolean;
  business_name?: string;
  business_stage?: string;
  industry?: string;
  state?: string;
  has_llc?: boolean;
  has_ein?: boolean;
  is_admin?: boolean;
}

// Predefined test users for consistent E2E testing
const TEST_USERS: TestUser[] = [
  {
    email: "test-free@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test Free User",
    tier: "free",
    onboarding_completed: true,
    business_name: "Free Test Business",
    business_stage: "idea",
    industry: "Technology",
    state: "CA",
    has_llc: false,
    has_ein: false,
  },
  {
    email: "test-starter@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test Starter User",
    tier: "start",
    onboarding_completed: true,
    business_name: "Starter Test LLC",
    business_stage: "launching",
    industry: "E-commerce",
    state: "TX",
    has_llc: true,
    has_ein: true,
  },
  {
    email: "test-pro@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test Pro User",
    tier: "build",
    onboarding_completed: true,
    business_name: "Pro Test Corp",
    business_stage: "growing",
    industry: "Consulting",
    state: "NY",
    has_llc: true,
    has_ein: true,
  },
  {
    email: "test-elite@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test Elite User",
    tier: "scale",
    onboarding_completed: true,
    business_name: "Elite Test Enterprises",
    business_stage: "scaling",
    industry: "Finance",
    state: "FL",
    has_llc: true,
    has_ein: true,
  },
  {
    email: "test-new@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test New User",
    tier: "free",
    onboarding_completed: false,
  },
  {
    email: "test-admin@neko-test.local",
    password: "TestPassword123!",
    full_name: "Test Admin User",
    tier: "scale",
    onboarding_completed: true,
    business_name: "Admin Test Corp",
    business_stage: "scaling",
    industry: "Technology",
    state: "CA",
    has_llc: true,
    has_ein: true,
    is_admin: true,
  },
];

// Sample progress data for completed onboarding users
const SAMPLE_PROGRESS = [
  { module: "business_starter", step: "create_llc", completed: true },
  { module: "business_starter", step: "get_ein", completed: true },
  { module: "business_starter", step: "open_business_bank", completed: false },
];

// Sample tasks
const SAMPLE_TASKS = [
  { title: "Complete LLC registration", module: "business_starter", step: "create_llc", status: "done", priority: "high" },
  { title: "Apply for EIN", module: "business_starter", step: "get_ein", status: "in_progress", priority: "high" },
  { title: "Open business bank account", module: "business_starter", step: "open_business_bank", status: "todo", priority: "medium" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security check: Only allow if ALLOW_TEST_SEEDING is explicitly set
    const allowSeeding = Deno.env.get("ALLOW_TEST_SEEDING");
    if (allowSeeding !== "true") {
      return new Response(
        JSON.stringify({ error: "Test seeding is disabled in this environment" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, seed_key } = await req.json();

    // Verify seed key for additional security
    const expectedSeedKey = Deno.env.get("SEED_SECRET_KEY");
    if (!expectedSeedKey || seed_key !== expectedSeedKey) {
      return new Response(
        JSON.stringify({ error: "Invalid seed key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for admin operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAdmin: any = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    if (action === "cleanup") {
      return await cleanupTestData(supabaseAdmin);
    }

    if (action === "seed") {
      return await seedTestData(supabaseAdmin);
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'seed' or 'cleanup'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Seed error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedTestData(supabase: any) {
  const results: { email: string; status: string; error?: string }[] = [];

  for (const testUser of TEST_USERS) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingUser = existingUsers?.users?.find((u: any) => u.email === testUser.email);

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        results.push({ email: testUser.email, status: "exists" });
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: { full_name: testUser.full_name },
        });

        if (authError) throw authError;
        userId = authData.user!.id;

        // Note: The database trigger handle_new_user will create:
        // - Profile with full_name
        // - Free subscription
        // - User role

        // Wait for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        results.push({ email: testUser.email, status: "created" });
      }

      // Update profile with additional data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: testUser.full_name,
          business_name: testUser.business_name,
          business_stage: testUser.business_stage,
          industry: testUser.industry,
          state: testUser.state,
          has_llc: testUser.has_llc,
          has_ein: testUser.has_ein,
          onboarding_completed: testUser.onboarding_completed,
        })
        .eq("user_id", userId);

      if (profileError) console.error("Profile update error:", profileError);

      // Update subscription tier if not free
      if (testUser.tier !== "free") {
        const { error: subError } = await supabase
          .from("subscriptions")
          .update({
            plan: testUser.tier,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("user_id", userId);

        if (subError) console.error("Subscription update error:", subError);
      }

      // Add admin role if specified
      if (testUser.is_admin) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .upsert({
            user_id: userId,
            role: "admin",
          }, { onConflict: "user_id,role" });

        if (roleError) console.error("Role update error:", roleError);
      }

      // Add sample progress for completed onboarding users
      if (testUser.onboarding_completed && testUser.tier !== "free") {
        for (const progress of SAMPLE_PROGRESS) {
          await supabase
            .from("progress")
            .upsert({
              user_id: userId,
              module: progress.module,
              step: progress.step,
              completed: progress.completed,
              completed_at: progress.completed ? new Date().toISOString() : null,
            }, { onConflict: "user_id,module,step" });
        }
      }

      // Add sample tasks
      if (testUser.onboarding_completed) {
        // First delete existing tasks
        await supabase.from("user_tasks").delete().eq("user_id", userId);

        for (const task of SAMPLE_TASKS) {
          await supabase.from("user_tasks").insert({
            user_id: userId,
            title: task.title,
            module: task.module,
            step: task.step,
            status: task.status,
            priority: task.priority,
          });
        }
      }

      // Create streak data
      await supabase.from("user_streaks").upsert({
        user_id: userId,
        login_streak_current: testUser.onboarding_completed ? 3 : 0,
        login_streak_longest: testUser.onboarding_completed ? 5 : 0,
        task_streak_current: testUser.onboarding_completed ? 2 : 0,
        task_streak_longest: testUser.onboarding_completed ? 4 : 0,
        total_login_days: testUser.onboarding_completed ? 10 : 1,
        total_tasks_completed: testUser.onboarding_completed ? 5 : 0,
        last_login_date: new Date().toISOString().split("T")[0],
      }, { onConflict: "user_id" });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({ email: testUser.email, status: "error", error: errorMessage });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Test data seeded successfully",
      results,
      test_users: TEST_USERS.map(u => ({
        email: u.email,
        password: u.password,
        tier: u.tier,
        is_admin: u.is_admin || false,
        onboarding_completed: u.onboarding_completed,
      })),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cleanupTestData(supabase: any) {
  const testEmails = TEST_USERS.map(u => u.email);
  const results: { email: string; status: string; error?: string }[] = [];

  // Get all users and filter test users
  const { data: allUsers } = await supabase.auth.admin.listUsers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testUsers = allUsers?.users?.filter((u: any) => testEmails.includes(u.email || "")) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const user of testUsers as any[]) {
    try {
      // Delete auth user (cascades to related tables via foreign keys)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      results.push({ email: user.email || "", status: "deleted" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({ email: user.email || "", status: "error", error: errorMessage });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Test data cleaned up successfully",
      results,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
