// NEKO Entitlement System
// Centralized feature access control based on subscription tier

import { SubscriptionTier, tierMeetsRequirement } from "./subscription-tiers";

// Feature identifiers
export type Feature =
  // Core platform
  | "dashboard"
  | "marketplace_access"
  | "profile_management"
  // Digital CV
  | "digital_cv_viewer"
  | "digital_cv_editor"
  | "digital_cv_unlimited"
  // Personal Brand
  | "personal_brand_page"
  | "personal_brand_seo"
  | "personal_brand_publish"
  // Analytics
  | "analytics_basic"
  | "analytics_advanced"
  // Business Credit
  | "credit_building_steps"
  | "tradeline_tracker"
  | "score_monitoring"
  // Business Tools
  | "business_tools_limited"
  | "business_tools_full"
  // Credit & Compliance
  | "credit_monitoring_eligibility"
  | "compliance_tools_eligibility"
  // Support
  | "priority_support"
  // Discounts
  | "bundle_discounts"
  // Admin
  | "admin_preview";

// Entitlement configuration
interface FeatureConfig {
  requiredTier: SubscriptionTier;
  description: string;
  upgradeMessage?: string;
}

export const FEATURE_ENTITLEMENTS: Record<Feature, FeatureConfig> = {
  // Core - Available to all
  dashboard: {
    requiredTier: "free",
    description: "Access to user dashboard",
  },
  marketplace_access: {
    requiredTier: "free",
    description: "Browse service marketplace",
  },
  profile_management: {
    requiredTier: "free",
    description: "Manage profile and account",
  },

  // Digital CV
  digital_cv_viewer: {
    requiredTier: "pro",
    description: "View your Digital CV",
    upgradeMessage: "Upgrade to Pro to access your Digital CV",
  },
  digital_cv_editor: {
    requiredTier: "pro",
    description: "Edit your Digital CV (limited)",
    upgradeMessage: "Upgrade to Pro to edit your Digital CV",
  },
  digital_cv_unlimited: {
    requiredTier: "elite",
    description: "Unlimited Digital CV editing and versions",
    upgradeMessage: "Upgrade to Elite for unlimited CV editing",
  },

  // Personal Brand
  personal_brand_page: {
    requiredTier: "starter",
    description: "Personal brand page",
    upgradeMessage: "Upgrade to Starter to create your personal brand page",
  },
  personal_brand_seo: {
    requiredTier: "pro",
    description: "SEO settings for personal brand page",
    upgradeMessage: "Upgrade to Pro to access SEO settings",
  },
  personal_brand_publish: {
    requiredTier: "starter",
    description: "Publish your personal brand page",
    upgradeMessage: "Upgrade to Starter to publish your profile",
  },

  // Analytics
  analytics_basic: {
    requiredTier: "pro",
    description: "Basic analytics and insights",
    upgradeMessage: "Upgrade to Pro for analytics",
  },
  analytics_advanced: {
    requiredTier: "elite",
    description: "Advanced analytics and reporting",
    upgradeMessage: "Upgrade to Elite for advanced analytics",
  },

  // Business Credit
  credit_building_steps: {
    requiredTier: "free",
    description: "Access to credit building steps",
  },
  tradeline_tracker: {
    requiredTier: "starter",
    description: "Track vendor accounts and tradelines",
    upgradeMessage: "Upgrade to Starter to track your tradelines",
  },
  score_monitoring: {
    requiredTier: "pro",
    description: "Monitor business credit scores across bureaus",
    upgradeMessage: "Upgrade to Pro for score monitoring",
  },

  // Business Tools
  business_tools_limited: {
    requiredTier: "pro",
    description: "Access to limited business tools",
    upgradeMessage: "Upgrade to Pro for business tools",
  },
  business_tools_full: {
    requiredTier: "elite",
    description: "Full business tools access",
    upgradeMessage: "Upgrade to Elite for full business tools",
  },

  // Credit & Compliance
  credit_monitoring_eligibility: {
    requiredTier: "pro",
    description: "Eligible to purchase credit monitoring",
    upgradeMessage: "Upgrade to Pro to access credit monitoring",
  },
  compliance_tools_eligibility: {
    requiredTier: "elite",
    description: "Eligible to access compliance tools",
    upgradeMessage: "Upgrade to Elite for compliance tools",
  },

  // Support
  priority_support: {
    requiredTier: "elite",
    description: "Priority customer support",
    upgradeMessage: "Upgrade to Elite for priority support",
  },

  // Discounts
  bundle_discounts: {
    requiredTier: "pro",
    description: "Access to bundle discounts",
    upgradeMessage: "Upgrade to Pro for bundle discounts",
  },

  // Admin-only (not customer-facing)
  admin_preview: {
    requiredTier: "free", // Controlled separately via isAdmin
    description: "Admin preview mode (internal only)",
  },
};

// Check if a tier has access to a feature
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: Feature
): boolean {
  const config = FEATURE_ENTITLEMENTS[feature];
  return tierMeetsRequirement(tier, config.requiredTier);
}

// Get upgrade message for a feature
export function getUpgradeMessage(feature: Feature): string | undefined {
  return FEATURE_ENTITLEMENTS[feature].upgradeMessage;
}

// Get all features available for a tier
export function getFeaturesForTier(tier: SubscriptionTier): Feature[] {
  return Object.entries(FEATURE_ENTITLEMENTS)
    .filter(([_, config]) => tierMeetsRequirement(tier, config.requiredTier))
    .map(([feature]) => feature as Feature);
}

// Get features locked for a tier (for upsell)
export function getLockedFeatures(tier: SubscriptionTier): Feature[] {
  return Object.entries(FEATURE_ENTITLEMENTS)
    .filter(([_, config]) => !tierMeetsRequirement(tier, config.requiredTier))
    .map(([feature]) => feature as Feature);
}

// CV version limits by tier
export const CV_VERSION_LIMITS: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 1,
  pro: 3,
  elite: Infinity,
};
