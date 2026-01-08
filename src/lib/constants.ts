// NEKO Application Constants
// Centralized constants to avoid magic strings throughout the codebase

// ============================================================================
// INDUSTRIES
// ============================================================================
export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Retail",
  "Food & Beverage",
  "Professional Services",
  "Construction",
  "Manufacturing",
  "Transportation",
  "Education",
  "Entertainment",
  "Other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

// ============================================================================
// USER ROLES
// ============================================================================
export const APP_ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

// ============================================================================
// SUBSCRIPTION STATUSES
// ============================================================================
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[keyof typeof SUBSCRIPTION_STATUSES];

// ============================================================================
// TICKET STATUSES
// ============================================================================
export const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export type TicketStatus = (typeof TICKET_STATUSES)[keyof typeof TICKET_STATUSES];

// ============================================================================
// BUSINESS STAGES
// ============================================================================
export const BUSINESS_STAGES = [
  "Idea/Planning",
  "Just Started",
  "Established (1-2 years)",
  "Growing (3+ years)",
  "Scaling",
] as const;

export type BusinessStage = (typeof BUSINESS_STAGES)[number];

// ============================================================================
// CREDIT BUREAUS
// ============================================================================
export const CREDIT_BUREAUS = {
  DNB: "dun_bradstreet",
  EXPERIAN: "experian",
  EQUIFAX: "equifax",
} as const;

export type CreditBureau = (typeof CREDIT_BUREAUS)[keyof typeof CREDIT_BUREAUS];

// ============================================================================
// PAYMENT STATUSES
// ============================================================================
export const PAYMENT_STATUSES = {
  CURRENT: "current",
  LATE_30: "30_days_late",
  LATE_60: "60_days_late",
  LATE_90: "90_days_late",
  COLLECTIONS: "collections",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

// ============================================================================
// TASK PRIORITIES
// ============================================================================
export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

// ============================================================================
// TASK STATUSES
// ============================================================================
export const TASK_STATUSES = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

// ============================================================================
// RESOURCE CATEGORIES
// ============================================================================
export const RESOURCE_CATEGORIES = [
  "business_setup",
  "credit_building",
  "personal_brand",
  "compliance",
  "general",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

// ============================================================================
// API ENDPOINTS (for consistency)
// ============================================================================
export const EDGE_FUNCTIONS = {
  CHECK_SUBSCRIPTION: "check-subscription",
  CREATE_CHECKOUT: "create-checkout",
  CUSTOMER_PORTAL: "customer-portal",
  CHECK_ADDONS: "check-addons",
  PURCHASE_ADDON: "purchase-addon",
  CONTACT_SUBMIT: "contact-submit",
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  THEME: "neko-theme",
  SIDEBAR_COLLAPSED: "neko-sidebar-collapsed",
  ONBOARDING_STEP: "neko-onboarding-step",
  CHUNK_RELOAD_ATTEMPTED: "neko-chunk-reload-attempted",
} as const;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================
export const VALIDATION_LIMITS = {
  NAME_MAX: 100,
  BUSINESS_NAME_MAX: 150,
  EMAIL_MAX: 255,
  BIO_MAX: 500,
  HEADLINE_MAX: 120,
  MESSAGE_MAX: 2000,
  SLUG_MAX: 50,
  URL_MAX: 500,
} as const;
