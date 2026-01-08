import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// New tier price mapping with monthly and annual options
const TIER_PRICES: Record<string, { monthly: string; annual: string; product_id: string }> = {
  starter: {
    monthly: "price_1SnN4SLlRyOCUFRX6VQbrGjr",
    annual: "price_1SnN5HLlRyOCUFRXKZNkl7uC",
    product_id: "prod_TksqB7NIXg4KNK",
  },
  pro: {
    monthly: "price_1SnN4oLlRyOCUFRX7Uw8oAOQ",
    annual: "price_1SnN5VLlRyOCUFRXOUTTV8Yl",
    product_id: "prod_TksqgwJoMRqpuM",
  },
  elite: {
    monthly: "price_1SnN50LlRyOCUFRX80R5vh5u",
    annual: "price_1SnN5gLlRyOCUFRXbH0fw7gR",
    product_id: "prod_Tksqz2DPSSb64V",
  },
};

// Legacy tier name mapping for backward compatibility
const LEGACY_TIER_MAP: Record<string, string> = {
  start: "starter",
  build: "pro",
  scale: "elite",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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

    // Get the requested tier, billing period, and promo code from the body
    const body = await req.json();
    let tier = (body.tier as string)?.toLowerCase();
    const billingPeriod = (body.billingPeriod as string) || "monthly";
    const promoCode = body.promoCode as string | undefined;
    
    // Handle legacy tier names
    if (tier && LEGACY_TIER_MAP[tier]) {
      tier = LEGACY_TIER_MAP[tier];
      logStep("Mapped legacy tier name", { original: body.tier, mapped: tier });
    }
    
    if (!tier || !TIER_PRICES[tier]) {
      throw new Error(`Invalid tier: ${tier}. Valid tiers are: starter, pro, elite`);
    }

    const tierConfig = TIER_PRICES[tier];
    const priceId = billingPeriod === "annual" ? tierConfig.annual : tierConfig.monthly;
    logStep("Creating checkout for tier", { tier, billingPeriod, priceId, promoCode });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    const origin = req.headers.get("origin") || "https://neko.app";
    
    // Look up promo code and create/get Stripe coupon if valid
    let stripeCouponId: string | undefined;
    if (promoCode) {
      const { data: promoData, error: promoError } = await supabaseClient
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (!promoError && promoData) {
        // Check expiry
        const isExpired = promoData.expires_at && new Date(promoData.expires_at) < new Date();
        const isMaxedOut = promoData.max_uses && promoData.current_uses >= promoData.max_uses;
        
        if (!isExpired && !isMaxedOut && promoData.discount_percent && promoData.discount_percent > 0) {
          logStep("Valid promo code found", { code: promoCode, discount: promoData.discount_percent });
          
          // Create or get Stripe coupon
          const couponId = `NEKO_${promoCode.toUpperCase()}`;
          try {
            // Try to retrieve existing coupon
            await stripe.coupons.retrieve(couponId);
            stripeCouponId = couponId;
            logStep("Using existing Stripe coupon", { couponId });
          } catch {
            // Coupon doesn't exist, create it
            const coupon = await stripe.coupons.create({
              id: couponId,
              percent_off: promoData.discount_percent,
              duration: promoData.free_months && promoData.free_months > 0 ? "repeating" : "once",
              duration_in_months: promoData.free_months || undefined,
              name: `NEKO Promo: ${promoCode.toUpperCase()}`,
            });
            stripeCouponId = coupon.id;
            logStep("Created new Stripe coupon", { couponId: coupon.id });
          }

          // Increment usage counter
          await supabaseClient
            .from("promo_codes")
            .update({ current_uses: (promoData.current_uses || 0) + 1 })
            .eq("id", promoData.id);
        }
      } else {
        logStep("Promo code not found or invalid", { code: promoCode });
      }
    }
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/app?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
      metadata: {
        user_id: user.id,
        tier: tier,
        billing_period: billingPeriod,
        promo_code: promoCode || "",
      },
    };

    // Apply discount if we have a valid coupon
    if (stripeCouponId) {
      sessionConfig.discounts = [{ coupon: stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("Checkout session created", { sessionId: session.id, url: session.url, hasDiscount: !!stripeCouponId });

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
