import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useStreaks } from "@/hooks/use-streaks";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import {
  Crown,
  Flame,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

export default function WelcomeHeader() {
  const { user, profile, subscription } = useAuth();
  const { streaks } = useStreaks();
  
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-border p-6"
      role="banner"
      aria-label="Welcome section"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={new Date().toISOString()}>{currentDate}</time>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {getGreeting()}, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Your business building journey continues. Let's make progress today.
          </p>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak indicator */}
          {streaks && streaks.login_streak_current > 0 && (
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20"
              role="status"
              aria-label={`${streaks.login_streak_current} day login streak`}
            >
              <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                {streaks.login_streak_current} day streak
              </span>
            </div>
          )}

          {/* Subscription Status */}
          {subscription.tier !== "free" ? (
            <Link 
              to="/app/account"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                subscription.cancelAtPeriodEnd 
                  ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15" 
                  : "bg-primary/10 border-primary/20 hover:bg-primary/15"
              }`}
              aria-label={`${tierConfig.name} Plan - Click to manage`}
            >
              <Crown className={`h-4 w-4 ${subscription.cancelAtPeriodEnd ? "text-amber-500" : "text-primary"}`} aria-hidden="true" />
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${subscription.cancelAtPeriodEnd ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>
                  {tierConfig.name} Plan
                </span>
                {subscription.subscriptionEnd && (
                  <span className="text-xs text-muted-foreground">
                    {subscription.cancelAtPeriodEnd 
                      ? `Ends ${format(new Date(subscription.subscriptionEnd), "MMM d, yyyy")}`
                      : `Renews ${format(new Date(subscription.subscriptionEnd), "MMM d, yyyy")}`
                    }
                  </span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Upgrade Plan
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}