import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  CreditCard,
  Zap,
  Settings,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Calendar,
  RefreshCw,
  Crown,
  FileBarChart,
  Shield,
  Sparkles,
  Package,
  Save,
  Pencil,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

// Import centralized constants
import { INDUSTRIES, VALIDATION_LIMITS } from "@/lib/constants";

// Add-on status interface
interface AddonStatus {
  active: boolean;
  type: "recurring" | "one_time" | "hybrid";
  name: string;
  subscription_id?: string;
  subscription_end?: string;
  purchased_at?: string;
  cancel_at_period_end?: boolean;
}

// Icon mapping for add-ons
function getAddOnIcon(id: string) {
  switch (id) {
    case "advanced_reports":
      return FileBarChart;
    case "credit_monitoring":
    case "credit_monitoring_full":
    case "compliance_monitoring":
      return Shield;
    default:
      return Sparkles;
  }
}

export default function Account() {
  const { user, profile, subscription, refreshSubscription, refreshProfile } = useAuth();
  const { tier, subscriptionEnd, cancelAtPeriodEnd } = useSubscriptionTier();
  const [addons, setAddons] = useState<Record<string, AddonStatus>>({});
  const [isLoadingAddons, setIsLoadingAddons] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    industry: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        business_name: profile.business_name || "",
        industry: profile.industry || "",
      });
    }
  }, [profile]);

  // Fetch add-ons on mount
  useEffect(() => {
    fetchAddons();
  }, [user]);

  const fetchAddons = async () => {
    if (!user) {
      setIsLoadingAddons(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-addons");
      if (error) throw error;
      setAddons(data?.addons || {});
    } catch (error) {
      console.error("Error fetching add-ons:", error);
    } finally {
      setIsLoadingAddons(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshSubscription(), fetchAddons()]);
      toast.success("Subscription status refreshed");
    } catch (error) {
      toast.error("Failed to refresh status");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to open billing portal");
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        business_name: profile.business_name || "",
        industry: profile.industry || "",
      });
    }
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim() || null,
          business_name: formData.business_name.trim() || null,
          industry: formData.industry || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const activeAddons = Object.entries(addons).filter(([_, addon]) => addon.active);
  const tierConfig = SUBSCRIPTION_TIERS[tier];

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-display font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, subscription, and add-ons
        </p>
      </motion.div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="addons" className="gap-2">
            <Zap className="h-4 w-4" />
            Add-Ons
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>
                    Your subscription details and billing
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{tierConfig?.name || "Free"}</h3>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier === "free" ? "Basic access to NEKO platform" : `Premium ${tierConfig?.name} plan`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${tierConfig?.price || 0}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>

                {subscriptionEnd && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {cancelAtPeriodEnd ? "Cancels on" : "Renews on"}{" "}
                      <span className="font-medium text-foreground">
                        {format(new Date(subscriptionEnd), "MMMM d, yyyy")}
                      </span>
                    </span>
                    {cancelAtPeriodEnd && (
                      <Badge variant="destructive" className="text-xs">
                        Canceling
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleManageSubscription}
                  disabled={isOpeningPortal}
                  className="gap-2"
                >
                  {isOpeningPortal ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage Billing
                </Button>
                {tier === "free" && (
                  <Button variant="outline" asChild>
                    <a href="/pricing">Upgrade Plan</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add-Ons Tab */}
        <TabsContent value="addons" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    My Add-Ons
                  </CardTitle>
                  <CardDescription>
                    Your active add-on services and purchases
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAddons}
                  disabled={isLoadingAddons}
                >
                  {isLoadingAddons ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAddons ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : activeAddons.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No active add-ons</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Enhance your plan with premium add-on services
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/app">Browse Add-Ons</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAddons.map(([id, addon]) => {
                    const Icon = getAddOnIcon(id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{addon.name}</h4>
                              <Badge
                                variant="secondary"
                                className={
                                  addon.type === "recurring"
                                    ? "bg-blue-500/20 text-blue-600"
                                    : addon.type === "hybrid"
                                    ? "bg-purple-500/20 text-purple-600"
                                    : "bg-green-500/20 text-green-600"
                                }
                              >
                                {addon.type === "recurring"
                                  ? "Subscription"
                                  : addon.type === "hybrid"
                                  ? "Hybrid"
                                  : "One-Time"}
                              </Badge>
                              {addon.cancel_at_period_end && (
                                <Badge variant="destructive" className="text-xs">
                                  Canceling
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {addon.subscription_end && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {addon.cancel_at_period_end ? "Ends" : "Renews"}{" "}
                                  {format(new Date(addon.subscription_end), "MMM d, yyyy")}
                                </span>
                              )}
                              {addon.purchased_at && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  Purchased {format(new Date(addon.purchased_at), "MMM d, yyyy")}
                                </span>
                              )}
                            </div>
                          </div>
                          {(addon.type === "recurring" || addon.type === "hybrid") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleManageSubscription}
                              disabled={isOpeningPortal}
                              className="gap-1"
                            >
                              {isOpeningPortal ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Settings className="h-3 w-3" />
                              )}
                              Manage
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Want more features?</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse our add-on services to enhance your experience
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/app" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Browse Add-Ons
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and business information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      maxLength={VALIDATION_LIMITS.NAME_MAX}
                    />
                  ) : (
                    <Input value={profile?.full_name || "Not set"} disabled className="bg-muted" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  {isEditing ? (
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      placeholder="Enter your business name"
                      maxLength={VALIDATION_LIMITS.BUSINESS_NAME_MAX}
                    />
                  ) : (
                    <Input value={profile?.business_name || "Not set"} disabled className="bg-muted" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  {isEditing ? (
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={profile?.industry || "Not set"} disabled className="bg-muted" />
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
