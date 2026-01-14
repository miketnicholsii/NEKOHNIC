import { createContext } from "react";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export interface AdminPreviewContextType {
  isPreviewMode: boolean;
  previewTier: SubscriptionTier | null;
  startPreview: (tier: SubscriptionTier) => void;
  stopPreview: () => void;
  getEffectiveTier: (actualTier: SubscriptionTier) => SubscriptionTier;
}

export const AdminPreviewContext = createContext<AdminPreviewContextType | undefined>(undefined);
