// NEKO Subscription Tiers Configuration
// Maps product IDs to subscription tiers

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    product_id: null,
    price_id: null,
  },
  start: {
    name: "Start",
    price: 19,
    product_id: "prod_TjrJr11KgRexld",
    price_id: "price_1SmNazLlRyOCUFRXg2YtsQvM",
  },
  build: {
    name: "Build",
    price: 49,
    product_id: "prod_TjrJLggG2PAity",
    price_id: "price_1SmNbDLlRyOCUFRXfSntGFev",
  },
  scale: {
    name: "Scale",
    price: 99,
    product_id: "prod_TjrKR20UBv3ksL",
    price_id: "price_1SmNbSLlRyOCUFRX2TKdwjJY",
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Helper to get tier from product ID
export function getTierFromProductId(productId: string | null): SubscriptionTier {
  if (!productId) return "free";
  
  for (const [tier, config] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (config.product_id === productId) {
      return tier as SubscriptionTier;
    }
  }
  return "free";
}

// Helper to check if a tier meets minimum requirement
export function tierMeetsRequirement(
  currentTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const tierOrder: SubscriptionTier[] = ["free", "start", "build", "scale"];
  const currentIndex = tierOrder.indexOf(currentTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}
