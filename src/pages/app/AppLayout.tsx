import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/app/business-starter", label: "Business Starter", icon: Building2 },
  { href: "/app/business-credit", label: "Business Credit", icon: CreditCard },
  { href: "/app/personal-brand", label: "Personal Brand", icon: UserIcon },
  { href: "/app/resources", label: "Resources", icon: BookOpen },
];

const bottomNavItems = [
  { href: "/app/account", label: "Account", icon: Settings },
  { href: "/app/support", label: "Support", icon: HelpCircle },
];

const planBadges: Record<string, { label: string; color: string; icon?: typeof Sparkles }> = {
  free: { label: "Free", color: "bg-muted text-muted-foreground" },
  start: { label: "Start", color: "bg-primary/10 text-primary", icon: Sparkles },
  build: { label: "Build", color: "bg-secondary/10 text-secondary", icon: Crown },
  scale: { label: "Scale", color: "bg-tertiary text-tertiary-foreground", icon: Crown },
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, profile, subscription, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

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
    navigate("/");
  };

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPlan = planBadges[subscription.tier] || planBadges.free;
  const PlanIcon = currentPlan.icon || Sparkles;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <Link to="/app" className="font-display text-xl font-bold tracking-display text-foreground">
                NÈKO.
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            
            {/* Admin link if user is admin */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted mt-4 border-t border-border pt-4"
              >
                <Crown className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Bottom Nav */}
          <div className="p-4 space-y-1 border-t border-border">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
            >
              <LogOut className="h-5 w-5" />
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
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <span>Dashboard</span>
                {location.pathname !== "/app" && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-medium">
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
                className={cn("px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity", currentPlan.color)}
              >
                <PlanIcon className="h-3.5 w-3.5" />
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
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
