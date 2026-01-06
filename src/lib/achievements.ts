import { 
  Trophy, 
  Medal, 
  Star, 
  Zap, 
  Shield, 
  Crown, 
  Target, 
  Flame,
  Rocket,
  Award,
  BadgeCheck,
  Building2,
  CreditCard,
  FileText,
  Phone,
  Mail,
  Hash,
  Store,
  Wallet,
  TrendingUp,
  User,
  Globe,
  Sparkles,
  LucideIcon
} from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "foundation" | "credit" | "brand" | "milestone" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpReward: number;
  requirement: {
    type: "progress_step" | "progress_count" | "tradeline_count" | "credit_score" | "special";
    module?: string;
    step?: string;
    count?: number;
    minScore?: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // Foundation Badges
  {
    id: "first_step",
    name: "First Steps",
    description: "Complete your first progress step",
    icon: Rocket,
    category: "foundation",
    tier: "bronze",
    xpReward: 50,
    requirement: { type: "progress_count", count: 1 },
  },
  {
    id: "llc_formed",
    name: "Official Business",
    description: "Successfully form your LLC",
    icon: Building2,
    category: "foundation",
    tier: "silver",
    xpReward: 200,
    requirement: { type: "progress_step", module: "business_starter", step: "form_llc" },
  },
  {
    id: "ein_obtained",
    name: "Tax Ready",
    description: "Obtain your EIN from the IRS",
    icon: Hash,
    category: "foundation",
    tier: "silver",
    xpReward: 150,
    requirement: { type: "progress_step", module: "business_starter", step: "get_ein" },
  },
  {
    id: "bank_opened",
    name: "Money Moves",
    description: "Open your business bank account",
    icon: Wallet,
    category: "foundation",
    tier: "silver",
    xpReward: 150,
    requirement: { type: "progress_step", module: "business_starter", step: "bank_account" },
  },
  {
    id: "phone_setup",
    name: "Connected",
    description: "Set up your business phone line",
    icon: Phone,
    category: "foundation",
    tier: "bronze",
    xpReward: 100,
    requirement: { type: "progress_step", module: "business_starter", step: "business_phone" },
  },
  {
    id: "email_setup",
    name: "Professional Presence",
    description: "Set up your professional email",
    icon: Mail,
    category: "foundation",
    tier: "bronze",
    xpReward: 100,
    requirement: { type: "progress_step", module: "business_starter", step: "professional_email" },
  },
  {
    id: "foundation_complete",
    name: "Foundation Builder",
    description: "Complete all business starter steps",
    icon: Shield,
    category: "foundation",
    tier: "gold",
    xpReward: 500,
    requirement: { type: "progress_count", module: "business_starter", count: 5 },
  },

  // Credit Building Badges
  {
    id: "duns_obtained",
    name: "D-U-N-S Ready",
    description: "Register and obtain your DUNS number",
    icon: BadgeCheck,
    category: "credit",
    tier: "silver",
    xpReward: 200,
    requirement: { type: "progress_step", module: "business_credit", step: "duns_number" },
  },
  {
    id: "first_tradeline",
    name: "Credit Pioneer",
    description: "Open your first Net-30 vendor account",
    icon: Store,
    category: "credit",
    tier: "silver",
    xpReward: 250,
    requirement: { type: "tradeline_count", count: 1 },
  },
  {
    id: "three_tradelines",
    name: "Building Momentum",
    description: "Establish 3 active tradelines",
    icon: TrendingUp,
    category: "credit",
    tier: "gold",
    xpReward: 400,
    requirement: { type: "tradeline_count", count: 3 },
  },
  {
    id: "five_tradelines",
    name: "Credit Portfolio",
    description: "Establish 5 active tradelines",
    icon: Medal,
    category: "credit",
    tier: "gold",
    xpReward: 600,
    requirement: { type: "tradeline_count", count: 5 },
  },
  {
    id: "tier_2_unlocked",
    name: "Tier 2 Achiever",
    description: "Complete Tier 1 and unlock store credit",
    icon: CreditCard,
    category: "credit",
    tier: "gold",
    xpReward: 500,
    requirement: { type: "progress_step", module: "business_credit", step: "tier_2_store" },
  },
  {
    id: "tier_3_unlocked",
    name: "Credit Master",
    description: "Reach Tier 3 revolving credit status",
    icon: Crown,
    category: "credit",
    tier: "platinum",
    xpReward: 1000,
    requirement: { type: "progress_step", module: "business_credit", step: "tier_3_revolving" },
  },

  // Personal Brand Badges
  {
    id: "profile_created",
    name: "Identity Established",
    description: "Create your personal brand profile",
    icon: User,
    category: "brand",
    tier: "bronze",
    xpReward: 100,
    requirement: { type: "progress_step", module: "personal_brand", step: "setup_profile" },
  },
  {
    id: "brand_published",
    name: "Going Live",
    description: "Publish your Digital CV to the world",
    icon: Globe,
    category: "brand",
    tier: "silver",
    xpReward: 300,
    requirement: { type: "progress_step", module: "personal_brand", step: "publish" },
  },
  {
    id: "seo_optimized",
    name: "Search Ready",
    description: "Configure SEO settings for your profile",
    icon: Target,
    category: "brand",
    tier: "bronze",
    xpReward: 150,
    requirement: { type: "progress_step", module: "personal_brand", step: "configure_seo" },
  },

  // Milestone Badges
  {
    id: "ten_steps",
    name: "Making Progress",
    description: "Complete 10 total steps across all modules",
    icon: Flame,
    category: "milestone",
    tier: "silver",
    xpReward: 300,
    requirement: { type: "progress_count", count: 10 },
  },
  {
    id: "twenty_steps",
    name: "Unstoppable",
    description: "Complete 20 total steps across all modules",
    icon: Zap,
    category: "milestone",
    tier: "gold",
    xpReward: 500,
    requirement: { type: "progress_count", count: 20 },
  },
  {
    id: "all_modules_started",
    name: "Well Rounded",
    description: "Start progress in all three modules",
    icon: Star,
    category: "milestone",
    tier: "silver",
    xpReward: 250,
    requirement: { type: "special", count: 3 },
  },

  // Special Badges
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Join NÈKO in its early days",
    icon: Sparkles,
    category: "special",
    tier: "platinum",
    xpReward: 500,
    requirement: { type: "special" },
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every available step in all modules",
    icon: Trophy,
    category: "special",
    tier: "platinum",
    xpReward: 2000,
    requirement: { type: "progress_count", count: 30 },
  },
];

export const TIER_COLORS = {
  bronze: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
    glow: "shadow-amber-200/50 dark:shadow-amber-500/20",
  },
  silver: {
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-300 dark:border-slate-600",
    text: "text-slate-700 dark:text-slate-300",
    icon: "text-slate-500 dark:text-slate-400",
    glow: "shadow-slate-200/50 dark:shadow-slate-500/20",
  },
  gold: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-400 dark:border-yellow-600",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "text-yellow-500 dark:text-yellow-400",
    glow: "shadow-yellow-200/50 dark:shadow-yellow-500/30",
  },
  platinum: {
    bg: "bg-gradient-to-br from-primary/10 to-accent/10",
    border: "border-primary/50",
    text: "text-primary",
    icon: "text-primary",
    glow: "shadow-primary/30",
  },
};

export const CATEGORY_LABELS = {
  foundation: "Business Foundation",
  credit: "Credit Building",
  brand: "Personal Brand",
  milestone: "Milestones",
  special: "Special",
};

export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpForNextLevel: number; progress: number } {
  // XP required per level increases: 500, 750, 1000, 1250...
  let level = 1;
  let xpRemaining = totalXP;
  let xpForCurrentLevel = 500;

  while (xpRemaining >= xpForCurrentLevel) {
    xpRemaining -= xpForCurrentLevel;
    level++;
    xpForCurrentLevel = 500 + (level - 1) * 250;
  }

  return {
    level,
    currentXP: xpRemaining,
    xpForNextLevel: xpForCurrentLevel,
    progress: Math.round((xpRemaining / xpForCurrentLevel) * 100),
  };
}
