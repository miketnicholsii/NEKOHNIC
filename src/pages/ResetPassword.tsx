import { useState, useEffect, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  
  const passwordId = useId();
  const confirmId = useId();

  // Check if we have a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if this is a recovery session (user came from password reset email)
      if (session?.user) {
        setIsValidSession(true);
      } else {
        // Check URL hash for recovery token (Supabase sends tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        
        if (accessToken && type === "recovery") {
          // Set the session from the recovery token
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get("refresh_token") || "",
          });
          
          if (!error) {
            setIsValidSession(true);
            // Clear the hash to prevent token reuse
            window.history.replaceState(null, "", window.location.pathname);
          } else {
            setIsValidSession(false);
          }
        } else {
          setIsValidSession(false);
        }
      }
    };
    
    checkSession();
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;
    setPasswordError("");
    setConfirmError("");

    if (!password) {
      setPasswordError("Please enter a new password.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords don't match.");
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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Password updated!",
        description: "Your password has been changed successfully.",
      });
      
      // Redirect to app after a short delay
      setTimeout(() => {
        navigate("/app", { replace: true });
      }, 2000);
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

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <EccentricNavbar />
        <main className="flex-1 flex items-center justify-center p-4 pt-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-primary-foreground/70 text-sm">Verifying reset link...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <EccentricNavbar />
        <main className="flex-1 flex items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                Link expired or invalid
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                This password reset link has expired or is no longer valid. Please request a new one.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="cta" className="w-full">
                  <Link to="/forgot-password">Request New Link</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <EccentricNavbar />
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {/* Card */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <span className="font-display text-2xl font-bold tracking-display text-foreground">
                  NÈKO<span className="text-primary">.</span>
                </span>
              </Link>
            </div>

            {isSuccess ? (
              /* Success State */
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                  Password updated!
                </h1>
                <p className="text-muted-foreground text-sm mb-6">
                  Your password has been changed successfully. Redirecting you to your dashboard...
                </p>
                <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              /* Form State */
              <>
                <div className="text-center mb-8">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Create new password
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    Choose a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor={passwordId}>New Password</Label>
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
                        className={`h-12 pr-12 ${passwordError ? "border-destructive" : ""}`}
                        autoComplete="new-password"
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? `${passwordId}-error` : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p id={`${passwordId}-error`} className="text-sm text-destructive" role="alert">
                        {passwordError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor={confirmId}>Confirm Password</Label>
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
                        className={`h-12 pr-12 ${confirmError ? "border-destructive" : ""}`}
                        autoComplete="new-password"
                        aria-invalid={!!confirmError}
                        aria-describedby={confirmError ? `${confirmId}-error` : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmError && (
                      <p id={`${confirmId}-error`} className="text-sm text-destructive" role="alert">
                        {confirmError}
                      </p>
                    )}
                  </div>

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
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
