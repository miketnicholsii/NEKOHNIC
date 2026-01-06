import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/subscription-tiers";

interface Profile {
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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<AuthContextType["subscription"]>({
    tier: "free",
    subscribed: false,
    subscriptionEnd: null,
    cancelAtPeriodEnd: false,
  });

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  }, [session]);

  const refreshSubscription = useCallback(async () => {
    if (!session) {
      setSubscription({
        tier: "free",
        subscribed: false,
        subscriptionEnd: null,
        cancelAtPeriodEnd: false,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }

      if (data) {
        setSubscription({
          tier: (data.tier as SubscriptionTier) || "free",
          subscribed: data.subscribed || false,
          subscriptionEnd: data.subscription_end || null,
          cancelAtPeriodEnd: data.cancel_at_period_end || false,
        });
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    }
  }, [session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setSubscription({
      tier: "free",
      subscribed: false,
      subscriptionEnd: null,
      cancelAtPeriodEnd: false,
    });
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
            refreshSubscription();
          }, 0);
        } else {
          setIsAdmin(false);
          setProfile(null);
          setSubscription({
            tier: "free",
            subscribed: false,
            subscriptionEnd: null,
            cancelAtPeriodEnd: false,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        checkAdminRole(session.user.id);
        refreshSubscription();
      }
    });

    return () => authSubscription.unsubscribe();
  }, [checkAdminRole, refreshSubscription]);

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user) {
      refreshProfile();
    }
  }, [session, refreshProfile]);

  // Refresh subscription periodically (every 60 seconds)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session, refreshSubscription]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        profile,
        subscription,
        isAdmin,
        refreshSubscription,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
