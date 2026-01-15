import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useStreaks } from "@/hooks/use-streaks";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import { WelcomeHeaderSkeleton } from "./DashboardSkeletons";
import {
  Crown,
  Flame,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

export default function WelcomeHeader() {
  const { user, profile, subscription, isLoading: authLoading } = useAuth();
  const { streaks, isLoading: streaksLoading } = useStreaks();
  const prefersReducedMotion = useReducedMotion();

  // Show skeleton while critical data is loading
  if (authLoading) {
    return <WelcomeHeaderSkeleton />;
  }
  
  const tierConfig = SUBSCRIPTION_TIERS[subscription.tier];
  const firstName = profile?.full_name?.split(" ")[0] || 
                   user?.user_metadata?.full_name?.split(" ")[0] || 
                   "there";
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = format(new Date(), "EEEE, MMMM d");

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl bg-card border border-border p-5 sm:p-6"
      role="banner"
      aria-label="Welcome section"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={new Date().toISOString()}>{currentDate}</time>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            {getGreeting()}, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            What would you like to focus on today?
          </p>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Streak indicator */}
          {!streaksLoading && streaks && streaks.login_streak_current > 0 && (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
              role="status"
              aria-label={`${streaks.login_streak_current} day login streak`}
            >
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-xs font-medium">
                {streaks.login_streak_current} day streak
              </span>
            </div>
          )}

          {/* Subscription Status */}
          {subscription.tier !== "free" ? (
            <Link 
              to="/app/account"
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                subscription.cancelAtPeriodEnd 
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15" 
                  : "bg-primary/10 text-primary hover:bg-primary/15"
              }`}
              aria-label={`${tierConfig.name} Plan - Click to manage`}
            >
              <Crown className="h-3.5 w-3.5" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">
                  {tierConfig.name} Plan
                </span>
                {subscription.subscriptionEnd && (
                  <span className="text-[10px] opacity-70">
                    {subscription.cancelAtPeriodEnd 
                      ? `Ends ${format(new Date(subscription.subscriptionEnd), "MMM d")}`
                      : `Renews ${format(new Date(subscription.subscriptionEnd), "MMM d")}`
                    }
                  </span>
                )}
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}