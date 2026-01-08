import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminPreview, getPreviewableTiers } from "@/hooks/use-admin-preview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ShieldCheck, Crown, Sparkles, User } from "lucide-react";
import { SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

const tierIcons: Record<SubscriptionTier, React.ReactNode> = {
  free: <User className="h-4 w-4" />,
  starter: <Sparkles className="h-4 w-4" />,
  pro: <ShieldCheck className="h-4 w-4" />,
  elite: <Crown className="h-4 w-4" />,
};

const tierColors: Record<SubscriptionTier, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  pro: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  elite: "bg-amber-500/10 text-amber-500 border-amber-500/30",
};

export function AdminPreviewPanel() {
  const { isAdmin, subscription } = useAuth();
  const { isPreviewMode, previewTier, startPreview, stopPreview } = useAdminPreview();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("starter");
  
  const previewableTiers = getPreviewableTiers();

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Admin Preview Mode</CardTitle>
          </div>
          {isPreviewMode && (
            <Badge variant="outline" className={cn("gap-1", tierColors[previewTier || "free"])}>
              {tierIcons[previewTier || "free"]}
              Previewing: {previewTier?.charAt(0).toUpperCase()}{previewTier?.slice(1)}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">
          Test the app as different subscription tiers without changing your actual subscription.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Your actual tier:</span>
          <Badge variant="outline" className={cn("gap-1", tierColors[subscription.tier])}>
            {tierIcons[subscription.tier]}
            {subscription.tier.charAt(0).toUpperCase()}{subscription.tier.slice(1)}
          </Badge>
        </div>

        {isPreviewMode ? (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={stopPreview}
              className="flex-1 gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Stop Preview
            </Button>
            <Select 
              value={previewTier || "free"} 
              onValueChange={(value) => startPreview(value as SubscriptionTier)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Switch tier" />
              </SelectTrigger>
              <SelectContent>
                {previewableTiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    <div className="flex items-center gap-2">
                      {tierIcons[tier.id]}
                      <span>{tier.name}</span>
                      <span className="text-muted-foreground">
                        {tier.price === 0 ? "Free" : `$${tier.price}/mo`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Select 
              value={selectedTier} 
              onValueChange={(value) => setSelectedTier(value as SubscriptionTier)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select tier to preview" />
              </SelectTrigger>
              <SelectContent>
                {previewableTiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    <div className="flex items-center gap-2">
                      {tierIcons[tier.id]}
                      <span>{tier.name}</span>
                      <span className="text-muted-foreground">
                        {tier.price === 0 ? "Free" : `$${tier.price}/mo`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => startPreview(selectedTier)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Start Preview
            </Button>
          </div>
        )}

        {isPreviewMode && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠️ You are viewing the app as a <strong>{previewTier}</strong> user. 
            Features and access are simulated based on this tier.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Floating preview indicator for the app
export function AdminPreviewIndicator() {
  const { isAdmin } = useAuth();
  const { isPreviewMode, previewTier, stopPreview } = useAdminPreview();

  if (!isAdmin || !isPreviewMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 shadow-lg border",
        tierColors[previewTier || "free"],
        "bg-background/95 backdrop-blur-sm"
      )}>
        <Eye className="h-4 w-4 animate-pulse" />
        <span className="text-sm font-medium">
          Previewing: {previewTier?.charAt(0).toUpperCase()}{previewTier?.slice(1)}
        </span>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={stopPreview}
          className="h-6 px-2 ml-1"
        >
          <EyeOff className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
