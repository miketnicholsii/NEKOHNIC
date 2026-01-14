import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  User,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserWithDetails {
  id: string;
  user_id: string;
  full_name: string | null;
  business_name: string | null;
  business_stage: string | null;
  industry: string | null;
  state: string | null;
  has_llc: boolean | null;
  has_ein: boolean | null;
  onboarding_completed: boolean | null;
  created_at: string;
  subscription: {
    plan: string;
    status: string;
    current_period_end: string | null;
    stripe_customer_id: string | null;
  } | null;
  role: string;
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "start", label: "Start ($19/mo)" },
  { value: "build", label: "Build ($49/mo)" },
  { value: "scale", label: "Scale ($99/mo)" },
];

const PLAN_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  start: "bg-primary/10 text-primary",
  build: "bg-secondary/10 text-secondary",
  scale: "bg-tertiary text-tertiary-foreground",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Edit user state
  const [editingUser, setEditingUser] = useState<UserWithDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    business_name: "",
    plan: "free",
  });
  const [isSaving, setIsSaving] = useState(false);

  // View user state
  const [viewingUser, setViewingUser] = useState<UserWithDetails | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get profiles with count
      const query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data: profiles, error: profilesError, count } = await query;
      if (profilesError) throw profilesError;

      // Get subscriptions for all users
      const userIds = profiles?.map((p) => p.user_id) || [];
      const { data: subscriptions, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .in("user_id", userIds);

      if (subsError) throw subsError;

      // Get roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithDetails: UserWithDetails[] = (profiles || []).map((profile) => {
        const subscription = subscriptions?.find((s) => s.user_id === profile.user_id);
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        
        return {
          ...profile,
          subscription: subscription
            ? {
                plan: subscription.plan,
                status: subscription.status,
                current_period_end: subscription.current_period_end,
                stripe_customer_id: subscription.stripe_customer_id,
              }
            : null,
          role: userRole?.role || "user",
        };
      });

      // Filter by plan if needed
      let filteredUsers = usersWithDetails;
      if (filterPlan !== "all") {
        filteredUsers = usersWithDetails.filter(
          (u) => u.subscription?.plan === filterPlan
        );
      }

      setUsers(filteredUsers);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("We couldn't load the users right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, filterPlan, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleEditUser = (user: UserWithDetails) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name || "",
      business_name: user.business_name || "",
      plan: user.subscription?.plan || "free",
    });
    setIsEditDialogOpen(true);
  };

  const handleViewUser = (user: UserWithDetails) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setIsSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editFormData.full_name || null,
          business_name: editFormData.business_name || null,
        })
        .eq("user_id", editingUser.user_id);

      if (profileError) throw profileError;

      // Update subscription plan (manual tier override)
      if (editFormData.plan !== editingUser.subscription?.plan) {
        const { error: subError } = await supabase
          .from("subscriptions")
          .update({
            plan: editFormData.plan as "free" | "start" | "build" | "scale",
            status: "active",
          })
          .eq("user_id", editingUser.user_id);

        if (subError) throw subError;
      }

      toast.success("User updated — changes saved.");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("That didn't save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter by search
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.business_name?.toLowerCase().includes(query) ||
      user.user_id.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // Stats
  const stats = {
    total: totalCount,
    paid: users.filter((u) => u.subscription?.plan && u.subscription.plan !== "free").length,
    free: users.filter((u) => !u.subscription?.plan || u.subscription.plan === "free").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-primary-foreground/60">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
          Your Users
        </h1>
        <p className="text-primary-foreground/60">
          See who's here, how they're progressing, and lend a hand when needed.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Total Users</p>
          <p className="text-2xl font-bold text-primary-foreground">{stats.total}</p>
        </div>
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Paid Users</p>
          <p className="text-2xl font-bold text-green-500">{stats.paid}</p>
        </div>
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Free Users</p>
          <p className="text-2xl font-bold text-primary-foreground/60">{stats.free}</p>
        </div>
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Admins</p>
          <p className="text-2xl font-bold text-secondary">{stats.admins}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/40" />
          <Input
            placeholder="Search by name or business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40"
          />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-full sm:w-48 bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {PLAN_OPTIONS.map((plan) => (
              <SelectItem key={plan.value} value={plan.value}>
                {plan.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-primary-foreground/10 hover:bg-transparent">
                <TableHead className="text-primary-foreground/60">User</TableHead>
                <TableHead className="text-primary-foreground/60">Business</TableHead>
                <TableHead className="text-primary-foreground/60">Plan</TableHead>
                <TableHead className="text-primary-foreground/60">Role</TableHead>
                <TableHead className="text-primary-foreground/60">Joined</TableHead>
                <TableHead className="text-primary-foreground/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <User className="h-10 w-10 text-primary-foreground/40 mx-auto mb-2" />
                    <p className="text-primary-foreground/60">No users found — try adjusting your search.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {(user.full_name?.[0] || "U").toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-primary-foreground">
                            {user.full_name || "No name"}
                          </p>
                          <p className="text-xs text-primary-foreground/40 font-mono">
                            {user.user_id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-primary-foreground text-sm">
                        {user.business_name || "—"}
                      </p>
                      <p className="text-xs text-primary-foreground/40">
                        {user.industry || "No industry"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        PLAN_COLORS[user.subscription?.plan || "free"]
                      }`}>
                        {user.subscription?.plan || "free"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {user.role === "admin" && (
                          <Shield className="h-3.5 w-3.5 text-secondary" />
                        )}
                        <span className="text-sm text-primary-foreground capitalize">
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-primary-foreground/60">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUser(user)}
                          className="h-8 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                          className="h-8 w-8 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-primary-foreground/10">
            <p className="text-sm text-primary-foreground/60">
              Page {page} of {totalPages} ({totalCount} users)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="text-primary-foreground/60 hover:text-primary-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="text-primary-foreground/60 hover:text-primary-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={editFormData.full_name}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={editFormData.business_name}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, business_name: e.target.value }))}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label htmlFor="plan">Subscription Plan (Manual Override)</Label>
              <Select
                value={editFormData.plan}
                onValueChange={(value) => setEditFormData((prev) => ({ ...prev, plan: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((plan) => (
                    <SelectItem key={plan.value} value={plan.value}>
                      {plan.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                This manually overrides the user's subscription tier.
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveUser} disabled={isSaving} className="flex-1">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">
                    {(viewingUser.full_name?.[0] || "U").toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {viewingUser.full_name || "No name"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {viewingUser.user_id}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Business</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {viewingUser.business_name || "—"}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Stage</span>
                  </div>
                  <p className="font-medium text-foreground capitalize">
                    {viewingUser.business_stage || "—"}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Plan</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    PLAN_COLORS[viewingUser.subscription?.plan || "free"]
                  }`}>
                    {viewingUser.subscription?.plan || "free"}
                  </span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Joined</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {format(new Date(viewingUser.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* Business Setup Status */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Business Setup</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Has LLC</span>
                    {viewingUser.has_llc ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Has EIN</span>
                    {viewingUser.has_ein ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Onboarding Complete</span>
                    {viewingUser.onboarding_completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleEditUser(viewingUser)}
                className="w-full"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
