// Hook to get the effective subscription tier
// Combines actual subscription with admin preview mode

import { useAuth } from "@/hooks/use-auth";
import { useAdminPreview } from "@/hooks/use-admin-preview";
import { SubscriptionTier } from "@/lib/subscription-tiers";
import { hasFeatureAccess, Feature, getUpgradeMessage } from "@/lib/entitlements";

export function useSubscriptionTier() {
  const { subscription, isAdmin } = useAuth();
  const { isPreviewMode, previewTier, getEffectiveTier } = useAdminPreview();

  const effectiveTier = getEffectiveTier(subscription.tier);

  return {
    // The actual tier from Stripe
    actualTier: subscription.tier,
    // The effective tier (considering admin preview)
    tier: effectiveTier,
    // Whether this is a preview
    isPreviewMode,
    // The tier being previewed (if any)
    previewTier,
    // Whether the user is an admin
    isAdmin,
    // Subscription details
    subscribed: subscription.subscribed,
    subscriptionEnd: subscription.subscriptionEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
  };
}

// Hook for checking feature access with preview support
export function useFeatureAccess(feature: Feature) {
  const { tier, isPreviewMode } = useSubscriptionTier();

  const hasAccess = hasFeatureAccess(tier, feature);
  const upgradeMessage = getUpgradeMessage(feature);

  return {
    hasAccess,
    upgradeMessage: hasAccess ? undefined : upgradeMessage,
    isPreviewMode,
    tier,
  };
}

// Hook to check multiple features at once
export function useFeatureAccessMultiple(features: Feature[]) {
  const { tier, isPreviewMode } = useSubscriptionTier();

  const accessMap = features.reduce((acc, feature) => {
    acc[feature] = hasFeatureAccess(tier, feature);
    return acc;
  }, {} as Record<Feature, boolean>);

  return {
    accessMap,
    hasAllAccess: features.every(f => accessMap[f]),
    hasAnyAccess: features.some(f => accessMap[f]),
    isPreviewMode,
    tier,
  };
}
