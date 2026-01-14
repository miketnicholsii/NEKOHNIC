import { createContext } from "react";
import type { Feature } from "@/lib/entitlements";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export interface UpgradeModalOptions {
  feature?: Feature;
  title?: string;
  description?: string;
  showTierComparison?: boolean;
  ctaText?: string;
  onUpgrade?: () => void;
}

export interface UpgradeModalContextValue {
  openUpgradeModal: (options?: UpgradeModalOptions) => void;
  closeUpgradeModal: () => void;
  isOpen: boolean;
}

export const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null);
