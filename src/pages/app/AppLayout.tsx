import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  User as UserIcon,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Crown,
  BarChart3,
  Trophy,
  Loader2,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/app/business-starter", label: "Business Starter", icon: Building2 },
  { href: "/app/business-credit", label: "Business Credit", icon: CreditCard },
  { href: "/app/personal-brand", label: "Personal Brand", icon: UserIcon },
  { href: "/app/strategy", label: "Strategy Guide", icon: Gift },
  { href: "/app/achievements", label: "Achievements", icon: Trophy },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/resources", label: "Resources", icon: BookOpen },
];

const bottomNavItems = [
  { href: "/app/account", label: "Account", icon: Settings },
  { href: "/app/support", label: "Support", icon: HelpCircle },
];

// Plan badges configuration - uses normalized tier names from SUBSCRIPTION_TIERS
const planBadges: Record<string, { label: string; color: string; icon?: typeof Sparkles }> = {
  free: { label: "Free", color: "bg-muted text-muted-foreground" },
  starter: { label: "Starter", color: "bg-primary/10 text-primary", icon: Sparkles },
  pro: { label: "Pro", color: "bg-secondary/10 text-secondary", icon: Crown },
  elite: { label: "Elite", color: "bg-tertiary text-tertiary-foreground", icon: Crown },
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, profile, subscription, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to onboarding if not completed (but not if already on onboarding page)
  useEffect(() => {
    if (
      !isLoading && 
      user && 
      profile !== null && 
      !profile.onboarding_completed && 
      location.pathname !== "/app/onboarding"
    ) {
      navigate("/app/onboarding");
    }
  }, [isLoading, user, profile, location.pathname, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  // Redirect to login with preserved location for post-login redirect
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname + location.search }} 
      />
    );
  }

  const currentPlan = planBadges[subscription.tier] || planBadges.free;
  const PlanIcon = currentPlan.icon || Sparkles;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <Link 
                to="/app" 
                className="font-display text-xl font-bold tracking-display text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                aria-label="NÈKO Dashboard Home"
              >
                NÈKO.
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Primary navigation">
            <ul role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                      isActive(item.href, item.exact)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-current={isActive(item.href, item.exact) ? "page" : undefined}
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Admin link if user is admin */}
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Admin Panel"
                >
                  <Crown className="h-5 w-5" aria-hidden="true" />
                  Admin Panel
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom Nav */}
          <div className="p-4 space-y-1 border-t border-border">
            <nav aria-label="Secondary navigation">
              <ul role="list">
                {bottomNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      aria-label={item.label}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Sign out of your account"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border" role="banner">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
                aria-controls="sidebar-navigation"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
                <span>Dashboard</span>
                {location.pathname !== "/app" && (
                  <>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    <span className="text-foreground font-medium" aria-current="page">
                      {navItems.find((item) => isActive(item.href, item.exact))?.label ||
                        bottomNavItems.find((item) => isActive(item.href))?.label ||
                        "Page"}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Plan Badge */}
              <Link 
                to="/app/account"
                className={cn("px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring", currentPlan.color)}
                aria-label={`Current plan: ${SUBSCRIPTION_TIERS[subscription.tier].name}. Click to manage subscription.`}
              >
                <PlanIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {SUBSCRIPTION_TIERS[subscription.tier].name}
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  role="img"
                  aria-label={`Avatar for ${user.user_metadata?.full_name || user.email}`}
                >
                  <span className="text-sm font-semibold text-primary" aria-hidden="true">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
