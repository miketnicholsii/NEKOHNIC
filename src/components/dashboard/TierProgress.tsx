import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Sparkles, Eye } from "lucide-react";

const TIER_ORDER: SubscriptionTier[] = ["free", "starter", "pro", "elite"];

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: ["Dashboard Access", "Basic Progress Tracking"],
  starter: ["All Free features", "Business Starter Module", "Digital CV Viewer", "Task Management"],
  pro: ["All Starter features", "Digital CV Editor", "Personal Brand Page", "Basic Analytics", "Business Tools"],
  elite: ["All Pro features", "Advanced Analytics", "Compliance Tools", "Priority Support", "Unlimited Everything"],
};

export default function TierProgress() {
  const { tier: currentTier, isPreviewMode, actualTier } = useSubscriptionTier();
  const currentIndex = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">Your Plan</h3>
          {isPreviewMode && (
            <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30">
              <Eye className="h-3 w-3" />
              Preview
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {isPreviewMode 
            ? `Previewing as ${currentTier} (actual: ${actualTier})`
            : currentTier === "elite" 
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

      {currentTier !== "elite" && (
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
