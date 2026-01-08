// NEKO Bundles Configuration
// Pre-configured bundles with savings

import { SubscriptionTier } from "./subscription-tiers";

export interface Bundle {
  id: string;
  name: string;
  description: string;
  // Items included (by service ID)
  includedServiceIds: string[];
  // Pricing
  originalPrice: number; // Sum of individual prices
  bundlePrice: number;
  savings: number;
  // Eligibility
  requiredTier: SubscriptionTier;
  // Recommended for
  recommendedFor?: string;
  // Badge
  badge?: string;
}

export const BUNDLES: Bundle[] = [
  {
    id: "growth_bundle",
    name: "Growth Bundle",
    description: "Everything you need to establish your professional presence.",
    includedServiceIds: ["digital_cv_build", "brand_page_build", "resume_rewrite"],
    originalPrice: 149 + 199 + 99, // $447
    bundlePrice: 349,
    savings: 98,
    requiredTier: "pro",
    recommendedFor: "Pro users building their brand",
    badge: "Most Popular",
  },
  {
    id: "business_starter_bundle",
    name: "Business Starter Bundle",
    description: "Get your business credit journey started right.",
    includedServiceIds: ["credit_monitoring_full", "compliance_monitoring"],
    originalPrice: 99 + 29 * 3 + 39 * 3, // Setup + 3 months = $303
    bundlePrice: 299,
    savings: 4, // Plus waived setup for Elite
    requiredTier: "elite",
    recommendedFor: "Elite users ready for credit building",
    badge: "Best Value",
  },
  {
    id: "cv_essentials",
    name: "CV Essentials",
    description: "Professional CV and resume package.",
    includedServiceIds: ["digital_cv_build", "resume_rewrite"],
    originalPrice: 149 + 99, // $248
    bundlePrice: 199,
    savings: 49,
    requiredTier: "starter",
    recommendedFor: "Starter users building their CV",
  },
];

// Get bundle by ID
export function getBundleById(id: string): Bundle | undefined {
  return BUNDLES.find((bundle) => bundle.id === id);
}

// Get bundles available for a tier
// Defensive: handles null/undefined/unknown tiers safely (per engineering standards)
export function getBundlesForTier(
  tier: SubscriptionTier | string | null | undefined
): {
  available: Bundle[];
  locked: Bundle[];
} {
  const tierOrder: SubscriptionTier[] = ["free", "starter", "pro", "elite"];
  
  // Defensive: handle null/undefined/unknown tiers safely
  if (!tier || typeof tier !== "string") {
    return { available: [], locked: [...BUNDLES] };
  }

  const lowerTier = tier.toLowerCase() as SubscriptionTier;
  const tierIndex = tierOrder.indexOf(lowerTier);
  
  // If tier is unknown/invalid, return empty available, all locked
  if (tierIndex === -1) {
    console.warn(`getBundlesForTier: Unknown tier "${tier}", failing safe`);
    return { available: [], locked: [...BUNDLES] };
  }

  const available: Bundle[] = [];
  const locked: Bundle[] = [];

  BUNDLES.forEach((bundle) => {
    const requiredIndex = tierOrder.indexOf(bundle.requiredTier);
    if (requiredIndex === -1 || tierIndex >= requiredIndex) {
      available.push(bundle);
    } else {
      locked.push(bundle);
    }
  });

  return { available, locked };
}

// Calculate savings percentage
export function getSavingsPercentage(bundle: Bundle): number {
  return Math.round((bundle.savings / bundle.originalPrice) * 100);
}
