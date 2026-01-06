import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles } from "lucide-react";

const TIER_ORDER: SubscriptionTier[] = ["free", "start", "build", "scale"];

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: ["Business Starter Module", "Basic Progress Tracking"],
  start: ["All Free features", "Business Credit Module", "Personal Brand Builder", "Task Management"],
  build: ["All Start features", "Advanced Analytics", "Priority Support", "Trello Integration"],
  scale: ["All Build features", "1-on-1 Coaching", "Custom Strategies", "Unlimited Everything"],
};

export default function TierProgress() {
  const { subscription } = useAuth();
  const currentTier = subscription?.tier || "free";
  const currentIndex = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-lg font-bold text-foreground">Your Plan</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {currentTier === "scale" 
            ? "You have access to all features!" 
            : "Upgrade to unlock more features"
          }
        </p>
      </div>

      <div className="p-5 space-y-4">
        {TIER_ORDER.map((tier, index) => {
          const config = SUBSCRIPTION_TIERS[tier];
          const isUnlocked = index <= currentIndex;
          const isCurrent = tier === currentTier;
          const features = TIER_FEATURES[tier];

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-lg border transition-all ${
                isCurrent
                  ? "border-primary bg-primary/5"
                  : isUnlocked
                  ? "border-border bg-muted/30"
                  : "border-border/50 bg-muted/10"
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isUnlocked 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {isUnlocked ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                          {config.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {config.price === 0 ? "Free" : `$${config.price}/mo`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features preview */}
                <div className="ml-11 space-y-1">
                  {features.slice(0, 2).map((feature) => (
                    <div 
                      key={feature} 
                      className={`text-xs flex items-center gap-2 ${
                        isUnlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                      }`}
                    >
                      <div className={`w-1 h-1 rounded-full ${isUnlocked ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      {feature}
                    </div>
                  ))}
                  {features.length > 2 && (
                    <p className="text-xs text-muted-foreground/60">
                      +{features.length - 2} more features
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {currentTier !== "scale" && (
        <div className="p-5 pt-0">
          <Link to="/pricing">
            <Button variant="cta" className="w-full" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Plan
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
