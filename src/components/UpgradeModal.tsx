import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Lock, Sparkles, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Feature,
  FEATURE_ENTITLEMENTS,
  getUpgradeMessage,
} from "@/lib/entitlements";
import { SUBSCRIPTION_TIERS, SubscriptionTier, getTierIndex } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface UpgradeModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onOpenChange: (open: boolean) => void;
  /** The feature user is trying to access */
  feature?: Feature;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** The user's current tier */
  currentTier?: SubscriptionTier;
  /** Whether to show tier comparison */
  showTierComparison?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom CTA action */
  onUpgrade?: () => void;
}

// ============================================================================
// Tier Benefits Configuration
// ============================================================================

const TIER_BENEFITS: Record<SubscriptionTier, string[]> = {
  free: [
    "Basic dashboard access",
    "Limited resources",
    "Community support",
  ],
  starter: [
    "Business Starter Kit",
    "Personal Brand Builder",
    "Email support",
    "5 tradelines tracking",
  ],
  pro: [
    "Everything in Starter",
    "Business Credit Building",
    "Priority support",
    "Unlimited tradelines",
    "Score monitoring",
  ],
  elite: [
    "Everything in Pro",
    "Advanced analytics",
    "Dedicated support",
    "Custom integrations",
    "All add-ons included",
  ],
};

// ============================================================================
// Helper Components
// ============================================================================

interface TierCardProps {
  tier: SubscriptionTier;
  isRequired: boolean;
  isCurrent: boolean;
}

const TierCard: React.FC<TierCardProps> = ({ tier, isRequired, isCurrent }) => {
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const benefits = TIER_BENEFITS[tier];

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all",
        isRequired
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : isCurrent
            ? "border-muted-foreground/30 bg-muted/30"
            : "border-border bg-card opacity-60"
      )}
    >
      {isRequired && (
        <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground">
          <Sparkles className="mr-1 h-3 w-3" />
          Recommended
        </Badge>
      )}
      {isCurrent && (
        <Badge variant="secondary" className="absolute -top-2.5 left-3">
          Current Plan
        </Badge>
      )}

      <div className="mb-3 mt-1">
        <h4 className="font-semibold text-foreground">{tierConfig.name}</h4>
        <p className="text-2xl font-bold text-foreground">
          ${tierConfig.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </div>

      <ul className="space-y-2">
        {benefits.slice(0, 4).map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onOpenChange,
  feature,
  title,
  description,
  currentTier = "free",
  showTierComparison = true,
  ctaText,
  onUpgrade,
}) => {
  const navigate = useNavigate();

  // Derive values from feature if provided
  const featureConfig = feature ? FEATURE_ENTITLEMENTS[feature] : null;
  const requiredTier = featureConfig?.requiredTier ?? "starter";
  const upgradeMessage = feature ? getUpgradeMessage(feature) : null;

  // Compute display values
  const displayTitle = title ?? "Upgrade to Unlock";
  const displayDescription =
    description ??
    upgradeMessage ??
    "This feature requires a higher subscription tier.";

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate("/pricing");
    }
    onOpenChange(false);
  };

  const handleViewPlans = () => {
    navigate("/pricing");
    onOpenChange(false);
  };

  // Determine tiers to show
  const currentTierIndex = getTierIndex(currentTier);
  const requiredTierIndex = getTierIndex(requiredTier);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="text-center sm:text-left">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:mx-0">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {displayTitle}
            {featureConfig && (
              <Badge variant="outline" className="ml-2 font-normal">
                {SUBSCRIPTION_TIERS[requiredTier].name}+ required
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {displayDescription}
          </DialogDescription>
        </DialogHeader>

        {showTierComparison && requiredTierIndex > currentTierIndex && (
          <div className="my-4 grid gap-3 sm:grid-cols-2">
            <TierCard
              tier={currentTier}
              isRequired={false}
              isCurrent={true}
            />
            <TierCard
              tier={requiredTier}
              isRequired={true}
              isCurrent={false}
            />
          </div>
        )}

        {!showTierComparison && (
          <div className="my-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  {SUBSCRIPTION_TIERS[requiredTier].name} Plan
                </p>
                <p className="text-sm text-muted-foreground">
                  ${SUBSCRIPTION_TIERS[requiredTier].price}/month
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full gap-2 sm:w-auto"
          >
            {ctaText ?? "Upgrade Now"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          <button
            onClick={handleViewPlans}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Compare all plans
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// Hook for Easy Usage
// ============================================================================

export default UpgradeModal;
