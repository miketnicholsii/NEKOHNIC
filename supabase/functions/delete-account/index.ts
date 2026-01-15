import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
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

    // Get user's name from profile before deletion
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, business_name")
      .eq("user_id", user.id)
      .single();

    const userName = profile?.full_name || profile?.business_name || "there";

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

    // Send farewell email before deleting the user
    if (resendApiKey && user.email) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "NÈKO <noreply@hellonekoco.lovable.app>",
          to: [user.email],
          subject: "Your NÈKO account has been deleted",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">NÈKO</h1>
              </div>
              
              <div style="background: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 15px 0;">
                  Goodbye, ${userName}
                </h2>
                <p style="margin: 0 0 15px 0; color: #4b5563;">
                  Your NÈKO account has been permanently deleted as requested.
                </p>
                <p style="margin: 0 0 15px 0; color: #4b5563;">
                  All your data has been removed from our systems, including:
                </p>
                <ul style="color: #4b5563; margin: 0 0 15px 0; padding-left: 20px;">
                  <li>Profile and business information</li>
                  <li>Credit scores and tradelines</li>
                  <li>Digital CV and portfolio</li>
                  <li>Tasks and progress records</li>
                  <li>Subscription history</li>
                </ul>
              </div>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Changed your mind?</strong><br>
                  You're always welcome back. Simply create a new account at 
                  <a href="https://hellonekoco.lovable.app" style="color: #92400e;">hellonekoco.lovable.app</a>
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
                Thank you for being part of the NÈKO community.<br>
                We wish you all the best on your journey.
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This email was sent because your account was deleted.<br>
                  If you did not request this, please contact support immediately.
                </p>
              </div>
            </body>
            </html>
          `,
        });
        
        logStep("Farewell email sent successfully");
      } catch (emailError) {
        // Log but don't fail the deletion if email fails
        console.error("Failed to send farewell email:", emailError);
      }
    }

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