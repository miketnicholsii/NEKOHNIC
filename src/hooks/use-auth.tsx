import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/subscription-tiers";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  subscription: {
    tier: SubscriptionTier;
    subscribed: boolean;
    subscriptionEnd: string | null;
    cancelAtPeriodEnd: boolean;
  };
  isAdmin: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
        subscription,
        isAdmin,
        refreshSubscription,
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
