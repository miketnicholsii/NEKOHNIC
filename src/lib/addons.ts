// NEKO Add-Ons & Services Configuration
// Defines one-time, recurring, and hybrid add-on services

import { SubscriptionTier, normalizeTier } from "./subscription-tiers";

// Pricing types
export type PricingType = "one_time" | "recurring" | "hybrid";

// Add-on service definition
export interface AddOnService {
  id: string;
  name: string;
  description: string;
  pricingType: PricingType;
  // One-time or setup price
  price?: number;
  priceId?: string;
  productId?: string;
  // Recurring price (for recurring and hybrid)
  recurringPrice?: number;
  recurringPriceId?: string;
  recurringProductId?: string;
  recurringInterval?: "month" | "year";
  // Eligibility
  requiredTier: SubscriptionTier;
  // Category
  category: "cv" | "brand" | "business" | "credit" | "compliance" | "reports";
}

// One-time services
export const ONE_TIME_SERVICES: AddOnService[] = [
  {
    id: "digital_cv_build",
    name: "Digital CV Build",
    description: "Professional Digital CV build service. We create your perfect CV.",
    pricingType: "one_time",
    price: 149,
    priceId: "price_1SnN5uLlRyOCUFRXWcYqfH6O",
    productId: "prod_TksrjTEsUCR5bP",
    requiredTier: "starter",
    category: "cv",
  },
  {
    id: "resume_rewrite",
    name: "Resume Rewrite",
    description: "Professional resume rewrite service. One-time deliverable.",
    pricingType: "one_time",
    price: 99,
    priceId: "price_1SnN6ELlRyOCUFRX2OQKCEgl",
    productId: "prod_TksrX8WrpcKVkW",
    requiredTier: "starter",
    category: "cv",
  },
  {
    id: "brand_page_build",
    name: "Brand Page Build",
    description: "Custom personal brand page build. We design your unique presence.",
    pricingType: "one_time",
    price: 199,
    priceId: "price_1SnN6PLlRyOCUFRXGGFIEGJ5",
    productId: "prod_TkssmTlIwHwi27",
    requiredTier: "pro",
    category: "brand",
  },
  {
    id: "business_formation_docs",
    name: "Business Formation Docs",
    description: "Business formation document preparation. Get set up right.",
    pricingType: "one_time",
    price: 249,
    priceId: "price_1SnN6YLlRyOCUFRXddjmyVEZ",
    productId: "prod_Tkssy6h3TwA6q7",
    requiredTier: "starter",
    category: "business",
  },
];

// Recurring services
export const RECURRING_SERVICES: AddOnService[] = [
  {
    id: "credit_monitoring",
    name: "Business Credit Monitoring",
    description: "Ongoing business credit monitoring with alerts and recommendations.",
    pricingType: "recurring",
    recurringPrice: 29,
    recurringPriceId: "price_1SnN9WLlRyOCUFRXGDFYHFrg",
    recurringProductId: "prod_TksvRSnMpyHdib",
    recurringInterval: "month",
    requiredTier: "pro",
    category: "credit",
  },
  {
    id: "compliance_monitoring",
    name: "Compliance Monitoring",
    description: "Ongoing compliance monitoring and alerts for your business.",
    pricingType: "recurring",
    recurringPrice: 39,
    recurringPriceId: "price_1SnN9hLlRyOCUFRX477nYSKi",
    recurringProductId: "prod_Tksv2eRs9paI7I",
    recurringInterval: "month",
    requiredTier: "elite",
    category: "compliance",
  },
  {
    id: "advanced_reports",
    name: "Advanced Reports",
    description: "Advanced monthly analytics and business reports.",
    pricingType: "recurring",
    recurringPrice: 15,
    recurringPriceId: "price_1SnN9rLlRyOCUFRX4GMxvkrP",
    recurringProductId: "prod_TksvxCGn3MF1B8",
    recurringInterval: "month",
    requiredTier: "pro",
    category: "reports",
  },
];

// Hybrid services (setup + recurring)
export const HYBRID_SERVICES: AddOnService[] = [
  {
    id: "credit_monitoring_full",
    name: "Business Credit Monitoring (Full Setup)",
    description: "Complete credit monitoring setup with ongoing monitoring. Setup fee + monthly.",
    pricingType: "hybrid",
    price: 99, // Setup fee
    priceId: "price_1SnNA1LlRyOCUFRXcbv3Z3DH",
    productId: "prod_Tksv1ldDXPihrz",
    recurringPrice: 29,
    recurringPriceId: "price_1SnN9WLlRyOCUFRXGDFYHFrg",
    recurringProductId: "prod_TksvRSnMpyHdib",
    recurringInterval: "month",
    requiredTier: "pro",
    category: "credit",
  },
];

// All services combined
export const ALL_SERVICES: AddOnService[] = [
  ...ONE_TIME_SERVICES,
  ...RECURRING_SERVICES,
  ...HYBRID_SERVICES,
];

// Get service by ID
export function getServiceById(id: string): AddOnService | undefined {
  return ALL_SERVICES.find((service) => service.id === id);
}

// Get services by category
export function getServicesByCategory(category: AddOnService["category"]): AddOnService[] {
  return ALL_SERVICES.filter((service) => service.category === category);
}

// Get services available for a tier
export function getServicesForTier(
  tier: SubscriptionTier | string,
  services: AddOnService[] = ALL_SERVICES
): { available: AddOnService[]; locked: AddOnService[] } {
  const tierOrder: SubscriptionTier[] = ["free", "starter", "pro", "elite"];
  const normalizedTier = normalizeTier(tier);
  const tierIndex = tierOrder.indexOf(normalizedTier);

  const available: AddOnService[] = [];
  const locked: AddOnService[] = [];

  services.forEach((service) => {
    const requiredIndex = tierOrder.indexOf(service.requiredTier);
    if (tierIndex >= requiredIndex) {
      available.push(service);
    } else {
      locked.push(service);
    }
  });

  return { available, locked };
}
