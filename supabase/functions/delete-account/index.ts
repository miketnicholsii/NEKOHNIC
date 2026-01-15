import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[DELETE-ACCOUNT] ${step}`, details ? JSON.stringify(details) : "");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Validate environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing required environment variables");
    }

    // Create service role client (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Verify the user's JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body for confirmation
    const body = await req.json().catch(() => ({}));
    const { confirmEmail } = body;

    // Require email confirmation to prevent accidental deletion
    if (confirmEmail !== user.email) {
      return new Response(
        JSON.stringify({ error: "Email confirmation does not match" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Email confirmation verified");

    // Delete user data from all related tables
    // Order matters: delete from tables with foreign key dependencies first
    const tablesToClean = [
      "user_achievements",
      "user_tasks",
      "user_streaks",
      "tradelines",
      "credit_scores",
      "digital_cv",
      "dashboard_layouts",
      "progress",
      "support_tickets",
      "promo_code_redemptions",
      "subscriptions",
      "profiles",
    ];

    for (const table of tablesToClean) {
      logStep(`Deleting data from ${table}`);
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", user.id);

      if (error) {
        // Log but don't fail - some tables might not have data
        console.warn(`Warning: Could not delete from ${table}:`, error.message);
      }
    }

    // Also delete from user_roles
    logStep("Deleting user roles");
    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", user.id);

    logStep("User data cleaned up from all tables");

    // Finally, delete the user from auth.users
    logStep("Deleting user from auth.users");
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw new Error(`Failed to delete user account: ${deleteError.message}`);
    }

    logStep("User account deleted successfully", { userId: user.id });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your account has been permanently deleted" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[DELETE-ACCOUNT] Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
