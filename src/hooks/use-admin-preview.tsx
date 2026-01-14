import { useContext } from "react";
import { AdminPreviewContext } from "@/contexts/admin-preview-context";
import { SubscriptionTier, SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

export function useAdminPreview() {
  const context = useContext(AdminPreviewContext);
  if (context === undefined) {
    throw new Error("useAdminPreview must be used within an AdminPreviewProvider");
  }
  return context;
}

// Hook that combines auth subscription with admin preview
export function useEffectiveSubscription() {
  const preview = useAdminPreview();
  
  return {
    isPreviewMode: preview.isPreviewMode,
    previewTier: preview.previewTier,
    getEffectiveTier: preview.getEffectiveTier,
    startPreview: preview.startPreview,
    stopPreview: preview.stopPreview,
  };
}

// Get all available tiers for preview selection
export function getPreviewableTiers(): { id: SubscriptionTier; name: string; price: number }[] {
  return Object.entries(SUBSCRIPTION_TIERS).map(([id, config]) => ({
    id: id as SubscriptionTier,
    name: config.name,
    price: config.price,
  }));
}
