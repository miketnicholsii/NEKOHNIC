import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "public, max-age=21600, stale-while-revalidate=43200", // 6h cache, 12h stale
};

// In-memory cache for edge function
let cachedFollowers: { count: number | null; timestamp: number } | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Rate limiting
const rateLimitStore = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 60; // requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  let record = rateLimitStore.get(ip);
  
  if (!record || now > record.reset) {
    record = { count: 1, reset: now + oneMinute };
    rateLimitStore.set(ip, record);
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

async function fetchInstagramFollowers(): Promise<number | null> {
  // Priority 1: Manual override via env var
  const override = Deno.env.get("INSTAGRAM_FOLLOWERS_OVERRIDE");
  if (override) {
    const parsed = parseInt(override, 10);
    if (!isNaN(parsed)) {
      console.log("Using INSTAGRAM_FOLLOWERS_OVERRIDE:", parsed);
      return parsed;
    }
  }

  // Priority 2: Instagram Graph API (if configured)
  const accessToken = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  const businessAccountId = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  
  if (accessToken && businessAccountId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${businessAccountId}?fields=followers_count&access_token=${accessToken}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.followers_count !== undefined) {
          console.log("Fetched Instagram followers via API:", data.followers_count);
          return data.followers_count;
        }
      } else {
        console.error("Instagram API error:", await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch Instagram followers:", error);
    }
  }

  // Priority 3: Return null (UI will handle gracefully)
  console.log("No Instagram configuration found, returning null");
  return null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check cache
    const now = Date.now();
    if (cachedFollowers && (now - cachedFollowers.timestamp) < CACHE_TTL_MS) {
      console.log("Returning cached follower count");
      return new Response(
        JSON.stringify({ 
          followers: cachedFollowers.count,
          formatted: cachedFollowers.count ? formatFollowerCount(cachedFollowers.count) : null,
          cached: true 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Fetch fresh data
    const followers = await fetchInstagramFollowers();
    
    // Update cache
    cachedFollowers = { count: followers, timestamp: now };

    return new Response(
      JSON.stringify({ 
        followers,
        formatted: followers ? formatFollowerCount(followers) : null,
        cached: false 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", followers: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
