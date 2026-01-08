import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  FileBarChart,
  Shield,
  HeadphonesIcon,
  Lock,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileText,
  Palette,
  Building2,
} from "lucide-react";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ALL_SERVICES,
  AddOnService,
  getServicesForTier,
  ONE_TIME_SERVICES,
  RECURRING_SERVICES,
  HYBRID_SERVICES,
} from "@/lib/addons";

// Purchased addon type from the edge function
interface PurchasedAddon {
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
      return Shield;
    case "priority_support":
      return HeadphonesIcon;
    case "compliance_monitoring":
      return Shield;
    case "digital_cv_build":
    case "resume_rewrite":
      return FileText;
    case "brand_page_build":
      return Palette;
    case "business_formation_docs":
      return Building2;
    default:
      return Sparkles;
  }
}

// Featured add-ons to show on the dashboard widget
const FEATURED_ADDONS = [
  "advanced_reports",
  "credit_monitoring",
  "compliance_monitoring",
];

interface AddOnCardProps {
  addon: AddOnService;
  isLocked: boolean;
  onPurchase: (addonId: string) => void;
  onManage: () => void;
  isPurchasing: boolean;
  isManaging: boolean;
  purchasedAddonIds: string[];
}

function AddOnCard({ addon, isLocked, onPurchase, onManage, isPurchasing, isManaging, purchasedAddonIds }: AddOnCardProps) {
  const Icon = getAddOnIcon(addon.id);
  const isPurchased = purchasedAddonIds.includes(addon.id);
  const isRecurring = addon.pricingType === "recurring" || addon.pricingType === "hybrid";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all ${
        isLocked
          ? "bg-muted/30 border-border opacity-70"
          : isPurchased
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isLocked ? "bg-muted" : "bg-primary/10"
          }`}
        >
          <Icon className={`h-5 w-5 ${isLocked ? "text-muted-foreground" : "text-primary"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{addon.name}</h4>
            {isPurchased && (
              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            {isLocked && (
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Upgrade
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {addon.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {addon.pricingType === "one_time" && addon.price && (
                <span className="font-semibold">${addon.price}</span>
              )}
              {addon.pricingType === "recurring" && addon.recurringPrice && (
                <span>
                  <span className="font-semibold">${addon.recurringPrice}</span>
                  <span className="text-muted-foreground">/mo</span>
                </span>
              )}
              {addon.pricingType === "hybrid" && (
                <span className="text-xs">
                  <span className="font-semibold">${addon.price}</span>
                  <span className="text-muted-foreground"> + ${addon.recurringPrice}/mo</span>
                </span>
              )}
            </div>
            {!isLocked && isPurchased && isRecurring ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={onManage}
                disabled={isManaging}
                className="text-xs h-7"
              >
                {isManaging ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Manage"
                )}
              </Button>
            ) : !isLocked && !isPurchased ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPurchase(addon.id)}
                disabled={isPurchasing}
                className="text-xs h-7"
              >
                {isPurchasing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Get"
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AddOnsWidget() {
  const { tier } = useSubscriptionTier();
  const { user } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [purchasedAddons, setPurchasedAddons] = useState<Record<string, PurchasedAddon>>({});
  const [isLoadingAddons, setIsLoadingAddons] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { available, locked } = getServicesForTier(tier);
  
  // Fetch purchased add-ons from Stripe via edge function
  useEffect(() => {
    async function fetchPurchasedAddons() {
      if (!user) {
        setIsLoadingAddons(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("check-addons");
        
        if (error) {
          console.error("Error fetching add-ons:", error);
          return;
        }

        if (data?.addons) {
          setPurchasedAddons(data.addons);
        }
      } catch (err) {
        console.error("Failed to fetch add-ons:", err);
      } finally {
        setIsLoadingAddons(false);
      }
    }

    fetchPurchasedAddons();
  }, [user]);

  // Helper to check if an addon is purchased
  const isAddonPurchased = (addonId: string): boolean => {
    return purchasedAddons[addonId]?.active === true;
  };

  // Get list of active addon IDs for the card component
  const activeAddonIds = Object.entries(purchasedAddons)
    .filter(([_, addon]) => addon.active)
    .map(([id]) => id);
  
  // Get featured add-ons for the widget
  const featuredAddons = ALL_SERVICES.filter((a) =>
    FEATURED_ADDONS.includes(a.id)
  );

  const handlePurchase = async (addonId: string) => {
    if (!user) {
      toast.error("Please sign in to purchase add-ons");
      return;
    }

    setIsPurchasing(true);
    setPurchasingId(addonId);

    try {
      const { data, error } = await supabase.functions.invoke("purchase-addon", {
        body: { addonId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to start purchase");
    } finally {
      setIsPurchasing(false);
      setPurchasingId(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("Please sign in to manage subscriptions");
      return;
    }

    setIsManaging(true);

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Opening subscription management...");
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast.error(error.message || "Failed to open subscription portal");
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Add-Ons
          </CardTitle>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Add-On Services
                </SheetTitle>
                <SheetDescription>
                  Enhance your plan with these premium add-ons
                </SheetDescription>
              </SheetHeader>
              
              <Tabs defaultValue="all" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring</TabsTrigger>
                  <TabsTrigger value="one-time">One-Time</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[calc(100vh-14rem)] mt-4">
                  <TabsContent value="all" className="space-y-3 pr-4">
                    {ALL_SERVICES.map((addon) => {
                      const isLocked = locked.some((l) => l.id === addon.id);
                      return (
                        <AddOnCard
                          key={addon.id}
                          addon={addon}
                          isLocked={isLocked}
                          onPurchase={handlePurchase}
                          onManage={handleManageSubscription}
                          isPurchasing={isPurchasing && purchasingId === addon.id}
                          isManaging={isManaging}
                          purchasedAddonIds={activeAddonIds}
                        />
                      );
                    })}
                  </TabsContent>
                  
                  <TabsContent value="recurring" className="space-y-3 pr-4">
                    {RECURRING_SERVICES.map((addon) => {
                      const isLocked = locked.some((l) => l.id === addon.id);
                      return (
                        <AddOnCard
                          key={addon.id}
                          addon={addon}
                          isLocked={isLocked}
                          onPurchase={handlePurchase}
                          onManage={handleManageSubscription}
                          isPurchasing={isPurchasing && purchasingId === addon.id}
                          isManaging={isManaging}
                          purchasedAddonIds={activeAddonIds}
                        />
                      );
                    })}
                  </TabsContent>
                  
                  <TabsContent value="one-time" className="space-y-3 pr-4">
                    {ONE_TIME_SERVICES.map((addon) => {
                      const isLocked = locked.some((l) => l.id === addon.id);
                      return (
                        <AddOnCard
                          key={addon.id}
                          addon={addon}
                          isLocked={isLocked}
                          onPurchase={handlePurchase}
                          onManage={handleManageSubscription}
                          isPurchasing={isPurchasing && purchasingId === addon.id}
                          isManaging={isManaging}
                          purchasedAddonIds={activeAddonIds}
                        />
                      );
                    })}
                    {HYBRID_SERVICES.map((addon) => {
                      const isLocked = locked.some((l) => l.id === addon.id);
                      return (
                        <AddOnCard
                          key={addon.id}
                          addon={addon}
                          isLocked={isLocked}
                          onPurchase={handlePurchase}
                          onManage={handleManageSubscription}
                          isPurchasing={isPurchasing && purchasingId === addon.id}
                          isManaging={isManaging}
                          purchasedAddonIds={activeAddonIds}
                        />
                      );
                    })}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoadingAddons ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          featuredAddons.slice(0, 3).map((addon) => {
            const Icon = getAddOnIcon(addon.id);
            const isLocked = locked.some((l) => l.id === addon.id);
            const isPurchased = isAddonPurchased(addon.id);
            const isRecurring = addon.pricingType === "recurring" || addon.pricingType === "hybrid";

            return (
              <div
                key={addon.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isLocked ? "opacity-60" : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    isLocked ? "bg-muted" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isLocked ? "text-muted-foreground" : "text-primary"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{addon.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {addon.pricingType === "recurring"
                      ? `$${addon.recurringPrice}/mo`
                      : `$${addon.price}`}
                  </p>
                </div>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : isPurchased && isRecurring ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={handleManageSubscription}
                    disabled={isManaging}
                  >
                    {isManaging ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Manage"
                    )}
                  </Button>
                ) : isPurchased ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => handlePurchase(addon.id)}
                    disabled={isPurchasing && purchasingId === addon.id}
                  >
                    {isPurchasing && purchasingId === addon.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        Get
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => setSheetOpen(true)}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Browse All Add-Ons
        </Button>
      </CardContent>
    </Card>
  );
}
