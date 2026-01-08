// Admin Preview System
// Allows admins to preview the app as different subscription tiers

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { SubscriptionTier, SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

interface AdminPreviewContextType {
  // Whether preview mode is currently active
  isPreviewMode: boolean;
  // The tier being previewed (null when not in preview mode)
  previewTier: SubscriptionTier | null;
  // Start previewing a specific tier
  startPreview: (tier: SubscriptionTier) => void;
  // Stop preview mode and return to actual subscription
  stopPreview: () => void;
  // Get the effective tier (preview tier if active, otherwise actual tier)
  getEffectiveTier: (actualTier: SubscriptionTier) => SubscriptionTier;
}

const AdminPreviewContext = createContext<AdminPreviewContextType | undefined>(undefined);

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewTier, setPreviewTier] = useState<SubscriptionTier | null>(null);

  const startPreview = useCallback((tier: SubscriptionTier) => {
    setPreviewTier(tier);
    setIsPreviewMode(true);
    console.log(`[Admin Preview] Started previewing tier: ${tier}`);
  }, []);

  const stopPreview = useCallback(() => {
    setPreviewTier(null);
    setIsPreviewMode(false);
    console.log("[Admin Preview] Preview mode stopped");
  }, []);

  const getEffectiveTier = useCallback((actualTier: SubscriptionTier): SubscriptionTier => {
    if (isPreviewMode && previewTier) {
      return previewTier;
    }
    return actualTier;
  }, [isPreviewMode, previewTier]);

  return (
    <AdminPreviewContext.Provider
      value={{
        isPreviewMode,
        previewTier,
        startPreview,
        stopPreview,
        getEffectiveTier,
      }}
    >
      {children}
    </AdminPreviewContext.Provider>
  );
}

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
