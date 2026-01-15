import { useState, useEffect, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase, setRememberMePreference } from "@/integrations/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isGoogleOAuthEnabled } from "@/lib/auth-providers";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";

// Google icon component
const GoogleIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Empathetic error messages mapping
const getErrorMessage = (error: string): { title: string; description: string } => {
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes("already registered") || lowerError.includes("already exists")) {
    return {
      title: "You already have an account",
      description: "Try signing in instead, or reset your password if you've forgotten it.",
    };
  }
  if (lowerError.includes("password") && lowerError.includes("weak")) {
    return {
      title: "Let's strengthen that password",
      description: "Try adding numbers, special characters, or making it longer.",
    };
  }
  if (lowerError.includes("invalid email") || lowerError.includes("email")) {
    return {
      title: "That email doesn't look right",
      description: "Double-check the format and try again.",
    };
  }
  if (lowerError.includes("too many requests") || lowerError.includes("rate limit")) {
    return {
      title: "Let's slow down a moment",
      description: "Too many attempts. Please wait a minute before trying again.",
    };
  }
  if (lowerError.includes("network") || lowerError.includes("fetch")) {
    return {
      title: "Connection issue",
      description: "Check your internet connection and try again.",
    };
  }
  
  return {
    title: "That didn't work",
    description: error,
  };
};

export default function Signup() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const businessId = useId();

  const handleGoogleSignup = async () => {
    if (!isGoogleOAuthEnabled) {
      toast({
        title: "Google sign-in isn't configured",
        description: "Please use email signup or ask an admin to enable Google OAuth.",
        variant: "destructive",
      });
      return;
    }
    if (isGoogleLoading || isLoading) return;
    
    setIsGoogleLoading(true);
    try {
      setRememberMePreference(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/onboarding`,
        },
      });

      if (error) {
        toast({
          title: "Google sign-in unavailable",
          description: "Please try again or use email registration.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/app");
    }
  }, [authLoading, user, navigate]);

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameError("We'd love to know your name.");
      isValid = false;
    } else if (trimmedName.length < 2) {
      setNameError("Just 2 characters or more will do.");
      isValid = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("We'll need your email to create your account.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("That doesn't look like a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Choose a password to secure your account.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("At least 8 characters keeps things secure.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Those passwords don't match.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || !validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Set remember me preference (default to true for new signups)
      setRememberMePreference(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            full_name: fullName.trim(),
            business_name: businessName.trim() || null,
          },
        },
      });

      if (error) {
        const errorMessage = getErrorMessage(error.message);
        toast({
          title: errorMessage.title,
          description: errorMessage.description,
          variant: "destructive",
        });
        return;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        setIsSuccess(true);
      } else if (data.session) {
        // Auto-confirmed, redirect to onboarding
        toast({
          title: "Welcome to NÈKO!",
          description: "Let's get you set up.",
        });
        navigate("/app/onboarding", { replace: true });
      }
    } catch {
      toast({
        title: "Something unexpected happened",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  // Success state - email confirmation required
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero relative flex flex-col">
        <EccentricNavbar />
        <main className="relative overflow-hidden flex-1 flex items-center justify-center p-4 pt-24">
          <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
          
          <motion.div {...motionProps} className="w-full max-w-[420px] relative z-10">
            <div className="glass-card bg-card/95 rounded-2xl p-8 shadow-xl border border-border/60 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                Check your email
              </h1>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                We've sent a confirmation link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Click the link in the email to activate your account and start your journey.
              </p>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Go to Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" role="note">
              <p className="text-xs text-primary-foreground/70 text-center">
                Didn't receive the email? Check your spam folder.
              </p>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative flex flex-col">
      <EccentricNavbar />
      <main className="relative overflow-hidden flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        
        <motion.div {...motionProps} className="w-full max-w-[420px] relative z-10">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-md px-1 py-0.5 -ml-1"
            aria-label="Return to home page"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>

          {/* Glass Card */}
          <div 
            className="glass-card bg-card/95 rounded-2xl p-8 shadow-xl border border-border/60"
            role="form" 
            aria-labelledby="signup-heading"
          >
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <Link 
                to="/" 
                className="inline-block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="NÈKO home"
              >
                <span className="font-display text-2xl font-bold tracking-display text-foreground">
                  NÈKO<span className="text-primary">.</span>
                </span>
              </Link>
              <h1 id="signup-heading" className="font-display text-2xl font-bold text-foreground mt-6">
                Start your journey
              </h1>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Create your free account — no credit card required.
              </p>
            </div>

            {/* Google OAuth Button */}
            {isGoogleOAuthEnabled ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium gap-3 bg-background hover:bg-muted/50"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isLoading}
                aria-busy={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Connecting…
                  </span>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </Button>
            ) : (
              <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                Google sign-in isn&apos;t configured yet. Please use email to continue.
              </div>
            )}

            {/* Divider */}
            {isGoogleOAuthEnabled && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor={nameId} className="text-sm font-medium">
                  Full name
                </Label>
                <Input
                  id={nameId}
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  placeholder="Your name"
                  className={`h-12 transition-colors ${nameError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? `${nameId}-error` : undefined}
                />
                {nameError && (
                  <p id={`${nameId}-error`} className="text-sm text-destructive" role="alert">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor={emailId} className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="you@example.com"
                  className={`h-12 transition-colors ${emailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? `${emailId}-error` : undefined}
                />
                {emailError && (
                  <p id={`${emailId}-error`} className="text-sm text-destructive" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Business Name Field (Optional) */}
              <div className="space-y-2">
                <Label htmlFor={businessId} className="text-sm font-medium">
                  Business name <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id={businessId}
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business or future business"
                  className="h-12"
                  autoComplete="organization"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor={passwordId} className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="••••••••"
                    className={`h-12 pr-12 transition-colors ${passwordError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? `${passwordId}-error` : `${passwordId}-hint`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                {passwordError ? (
                  <p id={`${passwordId}-error`} className="text-sm text-destructive" role="alert">
                    {passwordError}
                  </p>
                ) : (
                  <p id={`${passwordId}-hint`} className="text-xs text-muted-foreground">
                    At least 8 characters
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor={confirmId} className="text-sm font-medium">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id={confirmId}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmError) setConfirmError("");
                    }}
                    placeholder="••••••••"
                    className={`h-12 pr-12 transition-colors ${confirmError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!confirmError}
                    aria-describedby={confirmError ? `${confirmId}-error` : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                {confirmError && (
                  <p id={`${confirmId}-error`} className="text-sm text-destructive" role="alert">
                    {confirmError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full h-12 text-base font-medium mt-6"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Creating account…
                  </span>
                ) : (
                  "Create Free Account"
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link to="/legal/terms" className="text-primary hover:underline">Terms</Link>
                {" "}and{" "}
                <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* What to expect */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" role="note">
            <p className="text-xs text-primary-foreground/70 text-center font-medium mb-2">
              What you'll get
            </p>
            <ul className="text-xs text-primary-foreground/50 text-center space-y-1">
              <li>✓ Access to learning resources</li>
              <li>✓ Progress tracking dashboard</li>
              <li>✓ Community support</li>
            </ul>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
