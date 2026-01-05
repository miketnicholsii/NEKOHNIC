import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple rate limiting store (in-memory, resets on cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // max submissions
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

interface ContactFormRequest {
  name: string;
  email: string;
  businessName?: string;
  stage?: string;
  goal?: string;
  message?: string;
  // Honeypot field - should always be empty
  website?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: string | undefined, maxLength: number): string {
  if (!str) return "";
  return str.slice(0, maxLength).replace(/[<>]/g, "").trim();
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
    if (isRateLimited(clientIp)) {
      console.log(`Rate limited IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: ContactFormRequest = await req.json();

    // Honeypot check - if website field is filled, it's likely a bot
    if (body.website && body.website.length > 0) {
      console.log("Honeypot triggered, rejecting submission");
      // Return success to not alert bots
      return new Response(
        JSON.stringify({ success: true, message: "Thank you for your submission!" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    const name = sanitizeString(body.name, 100);
    const email = sanitizeString(body.email, 255);

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ error: "Name is required and must be at least 2 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize optional fields
    const businessName = sanitizeString(body.businessName, 200);
    const stage = sanitizeString(body.stage, 50);
    const goal = sanitizeString(body.goal, 200);
    const message = sanitizeString(body.message, 2000);

    // Store submission in database
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
        JSON.stringify({ error: "Failed to save submission. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Contact submission saved for: ${email}`);

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: "NEKO <onboarding@resend.dev>",
        to: ["hello@helloneko.co"],
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
          <p style="color: #666; font-size: 12px;">Submitted at ${new Date().toISOString()}</p>
        `,
      });
      console.log("Admin notification email sent");
    } catch (emailError) {
      // Log but don't fail the request - submission is already saved
      console.error("Failed to send admin notification email:", emailError);
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
      console.log("Auto-reply email sent to:", email);
    } catch (emailError) {
      // Log but don't fail - submission is saved
      console.error("Failed to send auto-reply email:", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Thank you! We'll be in touch soon." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in contact-submit function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
