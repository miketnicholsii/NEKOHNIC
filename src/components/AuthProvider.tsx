import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { supabase, logAuthEventOnce } from "@/integrations/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { toast } from "@/hooks/use-toast";
import logger from "@/lib/logger";

// Cache subscription data in memory to prevent excessive API calls
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
let subscriptionCache: {
  data: AuthContextType["subscription"] | null;
  timestamp: number;
  userId: string | null;
} = { data: null, timestamp: 0, userId: null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [subscription, setSubscription] = useState<AuthContextType["subscription"]>({
    tier: "free",
    subscribed: false,
    subscriptionEnd: null,
    cancelAtPeriodEnd: false,
  });

  // Prevent concurrent subscription checks
  const isCheckingSubscription = useRef(false);
  const lastCheckTime = useRef(0);
  const lastUserId = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  const updateAuthState = useCallback((nextSession: Session | null) => {
    setSession((prev) =>
      prev?.access_token === nextSession?.access_token ? prev : nextSession,
    );
    setUser((prev) =>
      prev?.id === nextSession?.user?.id ? prev : nextSession?.user ?? null,
    );
  }, []);

  const finishLoading = useCallback(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setIsLoading(false);
    } else {
      setIsLoading((prev) => (prev ? false : prev));
    }
  }, []);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        logger.dataError("Failed to check admin role", { error: error.message });
      }
      setIsAdmin(!!data);
    } catch (error) {
      logger.authFailure("Error checking admin role", { 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
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
        logger.dataError("Error fetching profile", { error: error.message });
        return;
      }

      setProfile(data);
    } catch (error) {
      logger.dataError("Error refreshing profile", { 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }, [session]);

  const refreshSubscription = useCallback(
    async (force = false) => {
      if (!session) {
        setSubscription({
          tier: "free",
          subscribed: false,
          subscriptionEnd: null,
          cancelAtPeriodEnd: false,
        });
        return;
      }

      const now = Date.now();
      const userId = session.user.id;

      // Use cached data if available and not expired (unless forced)
      if (
        !force &&
        subscriptionCache.data &&
        subscriptionCache.userId === userId &&
        now - subscriptionCache.timestamp < CACHE_DURATION_MS
      ) {
        setSubscription(subscriptionCache.data);
        return;
      }

      // Prevent concurrent checks - minimum 10 seconds between API calls
      const MIN_CHECK_INTERVAL = 10000;
      if (
        isCheckingSubscription.current ||
        (!force && now - lastCheckTime.current < MIN_CHECK_INTERVAL)
      ) {
        return;
      }

      isCheckingSubscription.current = true;
      lastCheckTime.current = now;

      try {
      const { data, error } = await supabase.functions.invoke("check-subscription");

        if (error) {
          logger.dataError("Error checking subscription", { error: error.message });
          isCheckingSubscription.current = false;
          return;
        }

        if (data) {
          const subscriptionData: AuthContextType["subscription"] = {
            tier: (data.tier as SubscriptionTier) || "free",
            subscribed: data.subscribed || false,
            subscriptionEnd: data.subscription_end || null,
            cancelAtPeriodEnd: data.cancel_at_period_end || false,
          };

          // Update cache
          subscriptionCache = {
            data: subscriptionData,
            timestamp: now,
            userId,
          };

          setSubscription(subscriptionData);
        }
      } catch (error) {
        logger.dataError("Error refreshing subscription", { 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      } finally {
        isCheckingSubscription.current = false;
      }
    },
    [session],
  );

  const signOut = useCallback(async () => {
    // Clear cache on sign out
    subscriptionCache = { data: null, timestamp: 0, userId: null };

    await supabase.auth.signOut();
    lastUserId.current = null;
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

  // Track if we've shown the welcome toast for this session
  const hasShownWelcomeToast = useRef(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      logAuthEventOnce(event);
      updateAuthState(newSession);
      finishLoading();

      const nextUserId = newSession?.user?.id ?? null;
      const userChanged = nextUserId !== lastUserId.current;
      lastUserId.current = nextUserId;

      // Show personalized welcome toast for OAuth sign-ins
      if (event === "SIGNED_IN" && newSession?.user && !hasShownWelcomeToast.current) {
        hasShownWelcomeToast.current = true;
        const userMeta = newSession.user.user_metadata;
        const provider = newSession.user.app_metadata?.provider;
        
        // Get the user's name from OAuth metadata
        const displayName = userMeta?.full_name || userMeta?.name || userMeta?.email?.split("@")[0];
        
        if (provider && provider !== "email") {
          // OAuth login - show personalized welcome
          toast({
            title: displayName ? `Welcome, ${displayName}!` : "Welcome!",
            description: "You're now signed in. Let's get started.",
          });
        }
      }

      // Reset toast flag on sign out
      if (event === "SIGNED_OUT") {
        hasShownWelcomeToast.current = false;
      }

      // Defer Supabase calls with setTimeout
      if (newSession?.user) {
        setTimeout(() => {
          if (userChanged) {
            checkAdminRole(newSession.user.id);
          }
          // Only force refresh on sign in events
          refreshSubscription(event === "SIGNED_IN");
        }, 0);
      } else if (userChanged) {
        setIsAdmin(false);
        setProfile(null);
        subscriptionCache = { data: null, timestamp: 0, userId: null };
        setSubscription({
          tier: "free",
          subscribed: false,
          subscriptionEnd: null,
          cancelAtPeriodEnd: false,
        });
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      updateAuthState(existingSession);
      finishLoading();

      if (existingSession?.user) {
        lastUserId.current = existingSession.user.id;
        checkAdminRole(existingSession.user.id);
        refreshSubscription();
      }
    });

    return () => authSubscription.unsubscribe();
  }, [checkAdminRole, finishLoading, refreshSubscription, updateAuthState]);

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user) {
      refreshProfile();
    }
  }, [session, refreshProfile]);

  // Refresh subscription periodically (every 5 minutes instead of 60 seconds)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 5 * 60 * 1000); // 5 minutes

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
        refreshSubscription: () => refreshSubscription(true), // Force refresh when manually called
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
