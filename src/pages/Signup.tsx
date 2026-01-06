import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, Tag, XCircle } from "lucide-react";

const benefits = [
  "Free forever tier available",
  "No credit card required",
  "Progress tracking from day one",
  "Cancel anytime",
];

interface PromoCodeStatus {
  isValid: boolean;
  isChecking: boolean;
  message: string;
  promoData: {
    id: string;
    description: string;
    tier_upgrade: string | null;
    discount_percent: number;
    free_months: number;
  } | null;
}

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    promoCode: searchParams.get("promo") || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPromoField, setShowPromoField] = useState(!!searchParams.get("promo"));
  const [isLoading, setIsLoading] = useState(false);
  const [promoStatus, setPromoStatus] = useState<PromoCodeStatus>({
    isValid: false,
    isChecking: false,
    message: "",
    promoData: null,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/app");
    }
  }, [authLoading, user, navigate]);

  // Validate promo code on initial load if present in URL
  useEffect(() => {
    const promoFromUrl = searchParams.get("promo");
    if (promoFromUrl) {
      validatePromoCode(promoFromUrl);
    }
  }, [searchParams]);

  const validatePromoCode = async (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    
    if (!trimmedCode) {
      setPromoStatus({ isValid: false, isChecking: false, message: "", promoData: null });
      return;
    }

    setPromoStatus(prev => ({ ...prev, isChecking: true, message: "" }));

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("id, code, description, discount_percent, free_months, tier_upgrade, max_uses, current_uses, is_active, expires_at")
        .eq("code", trimmedCode)
        .single();

      if (error || !data) {
        setPromoStatus({
          isValid: false,
          isChecking: false,
          message: "Invalid promo code",
          promoData: null,
        });
        return;
      }

      // Check if code is active
      if (!data.is_active) {
        setPromoStatus({
          isValid: false,
          isChecking: false,
          message: "This promo code is no longer active",
          promoData: null,
        });
        return;
      }

      // Check if code has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setPromoStatus({
          isValid: false,
          isChecking: false,
          message: "This promo code has expired",
          promoData: null,
        });
        return;
      }

      // Check if code has reached max uses
      if (data.max_uses && data.current_uses >= data.max_uses) {
        setPromoStatus({
          isValid: false,
          isChecking: false,
          message: "This promo code has reached its usage limit",
          promoData: null,
        });
        return;
      }

      // Code is valid
      setPromoStatus({
        isValid: true,
        isChecking: false,
        message: data.description || "Promo code applied!",
        promoData: {
          id: data.id,
          description: data.description || "",
          tier_upgrade: data.tier_upgrade,
          discount_percent: data.discount_percent || 0,
          free_months: data.free_months || 0,
        },
      });
    } catch {
      setPromoStatus({
        isValid: false,
        isChecking: false,
        message: "Error validating promo code",
        promoData: null,
      });
    }
  };

  const handlePromoCodeChange = (value: string) => {
    setFormData({ ...formData, promoCode: value });
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validatePromoCode(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const promoCode = formData.promoCode.trim().toUpperCase();

    if (!name || !email || !password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    // If promo code is entered but invalid, show error
    if (promoCode && !promoStatus.isValid) {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code or remove it.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/app`;
      
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            promo_code: promoStatus.isValid ? promoCode : null,
            promo_code_id: promoStatus.promoData?.id || null,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Email already registered",
            description: "Please sign in instead or use a different email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      // If promo code was used and user was created, record the redemption
      if (promoStatus.isValid && promoStatus.promoData && signUpData.user) {
        try {
          // Insert redemption record
          await supabase.from("promo_code_redemptions").insert({
            promo_code_id: promoStatus.promoData.id,
            user_id: signUpData.user.id,
          });
        } catch {
          // Promo tracking failed but signup succeeded - continue
        }
      }

      const promoMessage = promoStatus.isValid 
        ? ` ${promoStatus.promoData?.description || "Promo code applied!"}`
        : "";

      toast({
        title: "Account created!",
        description: `Welcome to NÈKO.${promoMessage}`,
      });
      
      navigate("/app/onboarding");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold tracking-display text-foreground">
                NÈKO.
              </span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground mt-4">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Start your journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="h-12"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="h-12"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-12 pr-12"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                At least 8 characters
              </p>
            </div>

            {/* Promo Code Section */}
            {!showPromoField ? (
              <button
                type="button"
                onClick={() => setShowPromoField(true)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Tag className="h-4 w-4" />
                Have a promo code?
              </button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="promoCode">Promo Code</Label>
                <div className="relative">
                  <Input
                    id="promoCode"
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => handlePromoCodeChange(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className={`h-12 pr-12 uppercase ${
                      promoStatus.isValid 
                        ? "border-primary bg-primary/5" 
                        : promoStatus.message && !promoStatus.isChecking 
                          ? "border-destructive" 
                          : ""
                    }`}
                    maxLength={50}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {promoStatus.isChecking ? (
                      <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    ) : promoStatus.isValid ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : promoStatus.message ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : null}
                  </div>
                </div>
                {promoStatus.message && (
                  <p className={`text-xs ${promoStatus.isValid ? "text-primary" : "text-destructive"}`}>
                    {promoStatus.message}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Get Started Free"
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs text-primary-foreground/50 text-center mt-6 max-w-sm mx-auto">
          By signing up, you agree to our{" "}
          <Link to="/legal/terms" className="underline hover:text-primary-foreground/70">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/legal/privacy" className="underline hover:text-primary-foreground/70">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
