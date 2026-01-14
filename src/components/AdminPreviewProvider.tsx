import { ReactNode, useCallback, useState } from "react";
import { AdminPreviewContext } from "@/contexts/admin-preview-context";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

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

  const getEffectiveTier = useCallback(
    (actualTier: SubscriptionTier): SubscriptionTier => {
      if (isPreviewMode && previewTier) {
        return previewTier;
      }
      return actualTier;
    },
    [isPreviewMode, previewTier],
  );

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
