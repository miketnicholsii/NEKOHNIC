import { Outlet, useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Megaphone,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Home,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <p className="text-muted-foreground text-sm">Verifying access...</p>
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">This Area Is Restricted</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to view this page. If you think this is a mistake, please reach out.</p>
          <Link to="/app" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tertiary flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-tertiary border-r border-primary-foreground/10 transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-foreground/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/admin" className="font-display text-xl font-bold tracking-display text-primary-foreground">
                  NÈKO.
                </Link>
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-primary-foreground/60 hover:text-primary-foreground"
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
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-primary-foreground/10">
            <Link
              to="/app"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 mb-1"
            >
              <Home className="h-5 w-5" />
              Back to App
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 w-full"
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
        <header className="sticky top-0 z-30 bg-tertiary/80 backdrop-blur-xl border-b border-primary-foreground/10">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-primary-foreground/60 hover:text-primary-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <nav className="hidden sm:flex items-center gap-1 text-sm text-primary-foreground/60">
                <span>Admin</span>
                {location.pathname !== "/admin" && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-primary-foreground font-medium">
                      {navItems.find((item) => isActive(item.href, item.exact))?.label || "Page"}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-secondary">
                  {(user.email?.[0] || "A").toUpperCase()}
                </span>
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
