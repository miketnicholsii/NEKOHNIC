import { useFeatureAccess } from "@/hooks/use-subscription-tier";
import type { Feature } from "@/lib/entitlements";

/**
 * useFeatureGate - Hook version for programmatic access control
 *
 * Use when you need to conditionally render based on feature access
 * without the declarative component wrapper.
 */
export function useFeatureGate(feature: Feature) {
  return useFeatureAccess(feature);
}
