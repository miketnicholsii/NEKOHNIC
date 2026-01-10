import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Activity,
  ArrowRight,
  Clock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  freeUsers: number;
  paidUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalResources: number;
  openTickets: number;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  plan: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    freeUsers: 0,
    paidUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    totalResources: 0,
    openTickets: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = startOfDay(new Date());
      const weekAgo = subDays(today, 7);

      // Load all stats in parallel
      const [
        profilesResult,
        subscriptionsResult,
        resourcesResult,
        ticketsResult,
        recentUsersResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id, user_id, full_name, created_at", { count: "exact" }),
        supabase.from("subscriptions").select("id, user_id, plan, status, created_at"),
        supabase.from("resources").select("id", { count: "exact" }),
        supabase.from("support_tickets").select("id", { count: "exact" }).eq("status", "open"),
        supabase
          .from("profiles")
          .select("id, user_id, full_name, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const profiles = profilesResult.data || [];
      const subscriptions = subscriptionsResult.data || [];

      // Calculate stats
      const totalUsers = profiles.length;
      const activeSubscriptions = subscriptions.filter(
        (s) => s.status === "active" && s.plan !== "free"
      ).length;
      const freeUsers = subscriptions.filter((s) => s.plan === "free").length;
      const paidUsers = subscriptions.filter((s) => s.plan !== "free").length;
      
      const newUsersToday = profiles.filter(
        (p) => new Date(p.created_at) >= today
      ).length;
      const newUsersThisWeek = profiles.filter(
        (p) => new Date(p.created_at) >= weekAgo
      ).length;

      setStats({
        totalUsers,
        activeSubscriptions,
        freeUsers,
        paidUsers,
        newUsersToday,
        newUsersThisWeek,
        totalResources: resourcesResult.count || 0,
        openTickets: ticketsResult.count || 0,
      });

      // Map recent users with their subscription data
      const recentUsersMapped: RecentUser[] = (recentUsersResult.data || []).map((profile) => {
        const subscription = subscriptions.find((s) => s.user_id === profile.user_id);
        return {
          id: profile.id,
          email: "—", // Email not in profiles, would need auth.users access
          full_name: profile.full_name,
          created_at: profile.created_at,
          plan: subscription?.plan || "free",
        };
      });

      setRecentUsers(recentUsersMapped);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: `+${stats.newUsersThisWeek} this week`,
      href: "/admin/users",
    },
    {
      label: "Paid Subscribers",
      value: stats.paidUsers,
      icon: CreditCard,
      change: `${stats.freeUsers} free users`,
      href: "/admin/users",
    },
    {
      label: "Resources",
      value: stats.totalResources,
      icon: FileText,
      change: "Published content",
      href: "/admin/content",
    },
    {
      label: "Open Tickets",
      value: stats.openTickets,
      icon: AlertCircle,
      change: "Awaiting response",
      href: "/admin/users",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-primary-foreground/60">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-primary-foreground/60">
          Here's how things are going — take a look around.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
          >
            <Link
              to={stat.href}
              className="block p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary-foreground/70" />
                </div>
                <ArrowRight className="h-4 w-4 text-primary-foreground/40" />
              </div>
              <p className="text-2xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/60">
                {stat.label}
              </p>
              <p className="text-xs text-primary/80 font-medium mt-2">
                {stat.change}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl"
        >
          <div className="p-4 border-b border-primary-foreground/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary-foreground/70" />
              <h2 className="font-semibold text-primary-foreground">Recent Users</h2>
            </div>
            <Link
              to="/admin/users"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-primary-foreground/10">
            {recentUsers.length === 0 ? (
              <div className="p-6 text-center text-primary-foreground/60">
                No users yet — they'll show up here once they join.
              </div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {(user.full_name?.[0] || "U").toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-primary-foreground text-sm">
                        {user.full_name || "No name"}
                      </p>
                      <p className="text-xs text-primary-foreground/60">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === "free" 
                      ? "bg-muted text-muted-foreground" 
                      : "bg-primary/20 text-primary"
                  }`}>
                    {user.plan}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl"
        >
          <div className="p-4 border-b border-primary-foreground/10 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-foreground/70" />
            <h2 className="font-semibold text-primary-foreground">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary-foreground text-sm">Manage Users</p>
                <p className="text-xs text-primary-foreground/60">See who's here and how they're doing</p>
              </div>
            </Link>
            <Link
              to="/admin/content"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
            >
              <FileText className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-primary-foreground text-sm">Add a Resource</p>
                <p className="text-xs text-primary-foreground/60">Share guides, templates, and helpful content</p>
              </div>
            </Link>
            <Link
              to="/admin/plans"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-primary-foreground text-sm">View Plans</p>
                <p className="text-xs text-primary-foreground/60">Review pricing and subscription setup</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary-foreground/70" />
          <h2 className="font-semibold text-primary-foreground">Today's Summary</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-primary-foreground">{stats.newUsersToday}</p>
              <p className="text-sm text-primary-foreground/60">New signups</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-primary-foreground">
                {stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-primary-foreground/60">Conversion rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-foreground/5">
            <Activity className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold text-primary-foreground">{stats.activeSubscriptions}</p>
              <p className="text-sm text-primary-foreground/60">Active subscriptions</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}