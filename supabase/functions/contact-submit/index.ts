import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced rate limiting with per-minute and per-day limits
const rateLimitStore = new Map<string, { 
  minuteCount: number; 
  minuteReset: number;
  dayCount: number;
  dayReset: number;
  lastRequest: number;
}>();

const RATE_LIMIT_PER_MINUTE = 5;
const RATE_LIMIT_PER_DAY = 30;
const COOLDOWN_MS = 10000; // 10 second cooldown between requests

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;
  
  let record = rateLimitStore.get(ip);
  
  if (!record) {
    record = {
      minuteCount: 0,
      minuteReset: now + oneMinute,
      dayCount: 0,
      dayReset: now + oneDay,
      lastRequest: 0,
    };
    rateLimitStore.set(ip, record);
  }
  
  // Reset counters if windows have passed
  if (now > record.minuteReset) {
    record.minuteCount = 0;
    record.minuteReset = now + oneMinute;
  }
  if (now > record.dayReset) {
    record.dayCount = 0;
    record.dayReset = now + oneDay;
  }
  
  // Check cooldown
  if (record.lastRequest > 0 && (now - record.lastRequest) < COOLDOWN_MS) {
    return { allowed: false, reason: "Please wait a few seconds before submitting again." };
  }
  
  // Check minute limit
  if (record.minuteCount >= RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, reason: "Too many requests. Please try again in a minute." };
  }
  
  // Check day limit
  if (record.dayCount >= RATE_LIMIT_PER_DAY) {
    return { allowed: false, reason: "Daily submission limit reached. Please try again tomorrow." };
  }
  
  // Update counters
  record.minuteCount++;
  record.dayCount++;
  record.lastRequest = now;
  
  return { allowed: true };
}

interface ContactFormRequest {
  name: string;
  email: string;
  businessName?: string;
  stage?: string;
  goal?: string;
  message?: string;
  website?: string; // Honeypot
  turnstileToken?: string; // CAPTCHA token
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: string | undefined, maxLength: number): string {
  if (!str) return "";
  // Remove potential header injection patterns and HTML
  return str
    .slice(0, maxLength)
    .replace(/[\r\n]/g, " ") // Prevent header injection
    .replace(/[<>]/g, "") // Basic XSS prevention
    .trim();
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!turnstileSecretKey) {
    console.warn("TURNSTILE_SECRET_KEY not configured, skipping verification");
    return true; // Skip if not configured
  }
  
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecretKey,
        response: token,
        remoteip: ip,
      }),
    });
    
    const result = await response.json();
    console.log("Turnstile verification result:", result.success);
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    // Check rate limit
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      console.log(`Rate limited IP: ${clientIp} - ${rateCheck.reason}`);
      return new Response(
        JSON.stringify({ error: rateCheck.reason }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: ContactFormRequest = await req.json();

    // Honeypot check - if website field is filled, it's likely a bot
    if (body.website && body.website.length > 0) {
      console.log("Honeypot triggered, silently rejecting");
      // Return success to not alert bots
      return new Response(
        JSON.stringify({ success: true, message: "Thank you for your submission!" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify Turnstile CAPTCHA
    if (!body.turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Please complete the security check." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const turnstileValid = await verifyTurnstile(body.turnstileToken, clientIp);
    if (!turnstileValid) {
      console.log("Turnstile verification failed for IP:", clientIp);
      return new Response(
        JSON.stringify({ error: "Security verification failed. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and sanitize required fields
    const name = sanitizeString(body.name, 100);
    const email = sanitizeString(body.email, 255);

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ error: "Name is required and must be at least 2 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize optional fields
    const businessName = sanitizeString(body.businessName, 200);
    const stage = sanitizeString(body.stage, 50);
    const goal = sanitizeString(body.goal, 200);
    const message = sanitizeString(body.message, 2000);

    // Store submission using service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        business_name: businessName || null,
        stage: stage || null,
        goal: goal || null,
        message: message || null,
        ip_address: clientIp,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Unable to save your submission. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Contact submission saved for: ${email}`);

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: "NEKO <onboarding@resend.dev>",
        to: ["neko@helloneko.co"],
        subject: `New NEKO Lead: ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${businessName ? `<p><strong>Business Name:</strong> ${businessName}</p>` : ""}
          ${stage ? `<p><strong>Stage:</strong> ${stage}</p>` : ""}
          ${goal ? `<p><strong>Goal:</strong> ${goal}</p>` : ""}
          ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ""}
          <hr>
          <p style="color: #666; font-size: 12px;">Submitted at ${new Date().toISOString()} from IP: ${clientIp}</p>
        `,
      });
      console.log("Admin notification sent");
    } catch (emailError) {
      console.error("Admin email failed:", emailError);
    }

    // Send auto-reply to user
    try {
      await resend.emails.send({
        from: "NEKO <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to NEKO!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2EB8A8;">Hello, ${name}!</h1>
            <p>Thank you for reaching out to NEKO. We've received your submission and our team will review it shortly.</p>
            <p>We're excited to help you on your journey to build a legitimate business and personal brand.</p>
            <h3>What happens next?</h3>
            <ol>
              <li>Our team reviews your goals and current stage</li>
              <li>We'll send you login details and a personalized onboarding guide</li>
              <li>You'll begin your journey with NEKO as your guide</li>
            </ol>
            <p>In the meantime, feel free to explore our resources at <a href="https://helloneko.co" style="color: #2EB8A8;">helloneko.co</a></p>
            <p>Best regards,<br>The NEKO Team</p>
          </div>
        `,
      });
      console.log("Auto-reply sent to:", email);
    } catch (emailError) {
      console.error("Auto-reply failed:", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Thank you! We'll be in touch soon." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
