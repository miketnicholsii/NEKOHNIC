import { createContext } from "react";
import type { User, Session } from "@supabase/supabase-js";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  business_stage: string | null;
  industry: string | null;
  state: string | null;
  has_llc: boolean | null;
  has_ein: boolean | null;
  onboarding_completed: boolean | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
  subscription: {
    tier: SubscriptionTier;
    subscribed: boolean;
    subscriptionEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
  isAdmin: boolean;
  refreshSubscription: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
