import { useState, useEffect, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

// Empathetic error messages mapping
const getErrorMessage = (error: string): { title: string; description: string } => {
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes("invalid login credentials") || lowerError.includes("invalid credentials")) {
    return {
      title: "Those credentials didn't match",
      description: "Double-check your email and password, then try again.",
    };
  }
  if (lowerError.includes("email not confirmed")) {
    return {
      title: "Please confirm your email first",
      description: "Check your inbox for a confirmation link from us.",
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

export default function Login() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/app");
    }
  }, [authLoading, user, navigate]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("We'll need your email to sign you in.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("That doesn't look like a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Don't forget your password.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
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

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("neko_remember_me", "true");
      } else {
        localStorage.removeItem("neko_remember_me");
        sessionStorage.setItem("neko_session_only", "true");
      }

      toast({
        title: "Welcome back!",
        description: "Good to see you again.",
      });
      
      navigate("/app");
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

  return (
    <main className="min-h-screen bg-gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" 
        aria-hidden="true" 
      />
      
      <motion.div
        {...motionProps}
        className="w-full max-w-[420px] relative z-10"
      >
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
          aria-labelledby="login-heading"
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
            <h1 
              id="login-heading" 
              className="font-display text-2xl font-bold text-foreground mt-6"
            >
              Hello again
            </h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Welcome back — let's pick up where you left off.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                className={`h-12 transition-colors ${
                  emailError 
                    ? "border-destructive focus-visible:ring-destructive" 
                    : ""
                }`}
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? `${emailId}-error` : undefined}
              />
              {emailError && (
                <p 
                  id={`${emailId}-error`} 
                  className="text-sm text-destructive flex items-center gap-1.5"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={passwordId} className="text-sm font-medium">
                  Password
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-primary hover:text-primary/80 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                >
                  Forgot password?
                </Link>
              </div>
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
                  className={`h-12 pr-12 transition-colors ${
                    passwordError 
                      ? "border-destructive focus-visible:ring-destructive" 
                      : ""
                  }`}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? `${passwordId}-error` : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p 
                  id={`${passwordId}-error`} 
                  className="text-sm text-destructive flex items-center gap-1.5"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-start gap-3 py-1">
              <Checkbox
                id={rememberId}
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                aria-describedby={`${rememberId}-description`}
                className="mt-0.5"
              />
              <div className="flex flex-col gap-0.5">
                <Label 
                  htmlFor={rememberId} 
                  className="text-sm font-medium cursor-pointer leading-none"
                >
                  Remember me
                </Label>
                <span 
                  id={`${rememberId}-description`} 
                  className="text-xs text-muted-foreground leading-snug"
                >
                  Stay signed in on this device for 30 days
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Not a member yet?{" "}
            <Link 
              to="/contact" 
              className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
            >
              Say Hello
            </Link>
          </p>
        </div>

        {/* Invite-only hint */}
        <div 
          className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
          role="note"
        >
          <p className="text-xs text-primary-foreground/70 text-center font-medium">
            NÈKO is invite-only
          </p>
          <p className="text-xs text-primary-foreground/50 text-center mt-1">
            All you have to do is say hello.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
