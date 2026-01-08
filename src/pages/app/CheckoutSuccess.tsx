import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Confetti from "@/components/ui/confetti";

interface NextStep {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  label: string;
}

const SUBSCRIPTION_NEXT_STEPS: NextStep[] = [
  {
    icon: LayoutDashboard,
    title: "Explore Your Dashboard",
    description: "Check out your new features and tools available with your plan",
    href: "/app",
    label: "Go to Dashboard",
  },
  {
    icon: BookOpen,
    title: "Browse Resources",
    description: "Access exclusive guides and tutorials for your tier",
    href: "/app/resources",
    label: "View Resources",
  },
  {
    icon: Zap,
    title: "Add Premium Features",
    description: "Enhance your plan with add-on services",
    href: "/app/account",
    label: "Browse Add-Ons",
  },
];

const ADDON_NEXT_STEPS: NextStep[] = [
  {
    icon: LayoutDashboard,
    title: "Return to Dashboard",
    description: "Start using your new add-on features right away",
    href: "/app",
    label: "Go to Dashboard",
  },
  {
    icon: CreditCard,
    title: "Manage Your Add-Ons",
    description: "View and manage all your active add-ons",
    href: "/app/account",
    label: "View Account",
  },
  {
    icon: Zap,
    title: "Explore More Add-Ons",
    description: "Discover additional services to boost your business",
    href: "/app",
    label: "Browse Add-Ons",
  },
];

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // Determine purchase type from URL params
  const type = searchParams.get("type") || "subscription";
  const planName = searchParams.get("plan");
  const addonName = searchParams.get("addon");

  const isSubscription = type === "subscription";
  const purchaseName = isSubscription ? planName : addonName;
  const nextSteps = isSubscription ? SUBSCRIPTION_NEXT_STEPS : ADDON_NEXT_STEPS;

  useEffect(() => {
    // Refresh subscription status after successful checkout
    const refresh = async () => {
      try {
        await refreshSubscription();
      } catch (error) {
        console.error("Error refreshing subscription:", error);
      } finally {
        setIsRefreshing(false);
      }
    };
    refresh();

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [refreshSubscription]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {showConfetti && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
          <CardContent className="pt-12 pb-8 px-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
              className="relative mx-auto mb-6 w-20 h-20"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full border-2 border-primary">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <PartyPopper className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {isSubscription ? "Welcome to" : "Purchase Complete!"}
                </h1>
                <PartyPopper className="h-6 w-6 text-primary scale-x-[-1]" />
              </div>
              
              {purchaseName && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  {isSubscription ? (
                    <Crown className="h-6 w-6 text-primary" />
                  ) : (
                    <Zap className="h-6 w-6 text-primary" />
                  )}
                  <span className="text-xl md:text-2xl font-semibold text-primary">
                    {purchaseName}
                  </span>
                </div>
              )}

              <p className="text-muted-foreground max-w-md mx-auto">
                {isSubscription
                  ? "Your subscription is now active! You have full access to all the features included in your plan."
                  : "Your add-on has been activated and is ready to use. Thank you for your purchase!"}
              </p>
            </motion.div>

            {/* Loading state */}
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating your account...</span>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What's Next?
              </h2>

              <div className="grid gap-4">
                {nextSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      to={step.href}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  <LayoutDashboard className="h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
