import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// New product ID to tier mapping
const PRODUCT_TO_TIER: Record<string, string> = {
  // New tier products
  "prod_TksqB7NIXg4KNK": "starter",
  "prod_TksqgwJoMRqpuM": "pro",
  "prod_Tksqz2DPSSb64V": "elite",
  // Legacy products for backward compatibility
  "prod_TjrJr11KgRexld": "starter", // was "start"
  "prod_TjrJLggG2PAity": "pro",     // was "build"
  "prod_TjrKR20UBv3ksL": "elite",   // was "scale"
};

// Map new tier names to database enum values (for backward compatibility)
const TIER_TO_DB_PLAN: Record<string, string> = {
  free: "free",
  starter: "start",   // DB enum is still "start"
  pro: "build",       // DB enum is still "build"
  elite: "scale",     // DB enum is still "scale"
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning free tier");
      
      // Update local subscription to free
      await supabaseClient
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: "free",
          status: "active",
          stripe_customer_id: null,
          stripe_subscription_id: null,
        }, { onConflict: "user_id" });

      return new Response(JSON.stringify({
        subscribed: false,
        tier: "free",
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logStep("No active subscription found, returning free tier");
      
      // Update local subscription to free
      await supabaseClient
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: "free",
          status: "active",
          stripe_customer_id: customerId,
          stripe_subscription_id: null,
        }, { onConflict: "user_id" });

      return new Response(JSON.stringify({
        subscribed: false,
        tier: "free",
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscription = subscriptions.data[0];
    const priceItem = subscription.items.data[0];
    const productId = priceItem.price.product as string;
    const priceId = priceItem.price.id;
    
    // Get tier from product ID (handles both new and legacy products)
    const tier = PRODUCT_TO_TIER[productId] || "free";
    const dbPlan = TIER_TO_DB_PLAN[tier] || "free";
    
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
    const subscriptionStart = new Date(subscription.current_period_start * 1000).toISOString();
    
    // Determine billing period from price interval
    const interval = priceItem.price.recurring?.interval;
    const billingPeriod = interval === "year" ? "annual" : "monthly";
    
    logStep("Active subscription found", { 
      subscriptionId: subscription.id, 
      productId, 
      priceId,
      tier, 
      dbPlan,
      billingPeriod,
      endDate: subscriptionEnd 
    });

    // Update local subscription record
    await supabaseClient
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan: dbPlan,
        status: "active",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        current_period_start: subscriptionStart,
        current_period_end: subscriptionEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: "user_id" });

    return new Response(JSON.stringify({
      subscribed: true,
      tier: tier,
      product_id: productId,
      price_id: priceId,
      billing_period: billingPeriod,
      subscription_end: subscriptionEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
