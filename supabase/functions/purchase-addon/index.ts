import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Add-on configuration matching src/lib/addons.ts
type AddonConfig = { 
  price_id: string; 
  product_id: string; 
  type: "recurring" | "one_time";
  name: string;
};

const ADDONS: Record<string, AddonConfig> = {
  "advanced-reports": {
    price_id: "price_1SnN67LlRyOCUFRXOdM4L4Vp",
    product_id: "prod_TksrOOJnYbX8lY",
    type: "recurring",
    name: "Advanced Reports",
  },
  "credit-monitoring-setup": {
    price_id: "price_1SnN6PLlRyOCUFRXOqBRSyxG",
    product_id: "prod_TksrXDqr0EkDUB",
    type: "one_time",
    name: "Credit Monitoring Setup",
  },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PURCHASE-ADDON] ${step}${detailsStr}`);
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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get the requested addon from the body
    const body = await req.json();
    const addonId = body.addonId as string;
    
    if (!addonId || !ADDONS[addonId]) {
      const validAddons = Object.keys(ADDONS).join(", ");
      throw new Error(`Invalid addon: ${addonId}. Valid addons are: ${validAddons}`);
    }

    const addon = ADDONS[addonId];
    logStep("Processing addon purchase", { addonId, addon });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
      
      // For recurring addons, check if already subscribed
      if (addon.type === "recurring") {
        const existingSubscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
        });
        
        const alreadyHasAddon = existingSubscriptions.data.some((sub: Stripe.Subscription) => 
          sub.items.data.some((item: Stripe.SubscriptionItem) => item.price.id === addon.price_id)
        );
        
        if (alreadyHasAddon) {
          throw new Error(`You already have an active ${addon.name} subscription`);
        }
      }
    }

    const origin = req.headers.get("origin") || "https://neko.app";
    
    // Determine checkout mode based on addon type
    const mode = addon.type === "recurring" ? "subscription" : "payment";
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: addon.price_id,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${origin}/app?addon_purchase=success&addon=${addonId}`,
      cancel_url: `${origin}/app?addon_purchase=canceled`,
      metadata: {
        user_id: user.id,
        addon_id: addonId,
        addon_type: addon.type,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("Checkout session created", { 
      sessionId: session.id, 
      url: session.url,
      mode,
      addonId 
    });

    return new Response(JSON.stringify({ url: session.url }), {
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
