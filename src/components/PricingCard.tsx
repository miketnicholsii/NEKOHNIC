import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionTier, tierMeetsRequirement } from "@/lib/subscription-tiers";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  className?: string;
}

export const PricingCard = memo(function PricingCard({
  name,
  description,
  price,
  period = "/mo",
  features,
  highlighted = false,
  badge,
  className,
}: PricingCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const tierKey = name.toLowerCase() as SubscriptionTier;
  const isCurrentPlan = subscription.tier === tierKey;
  const isDowngrade = user && tierMeetsRequirement(subscription.tier, tierKey) && !isCurrentPlan;
  
  const handleClick = async () => {
    if (tierKey === "free") {
      if (user) {
        navigate("/app");
      } else {
        navigate("/contact");
      }
      return;
    }

    if (!user) {
      navigate("/contact");
      return;
    }

    if (isCurrentPlan) {
      navigate("/app");
      return;
    }

    if (subscription.subscribed) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("customer-portal");
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, "_blank");
        }
      } catch {
        toast({
          title: "Error",
          description: "Could not open billing portal. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const promoCode = localStorage.getItem("appliedPromoCode");
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: tierKey, promoCode: promoCode || undefined },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        localStorage.removeItem("appliedPromoCode");
        window.open(data.url, "_blank");
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (isCurrentPlan) return "Current Plan";
    if (isDowngrade && subscription.subscribed) return "Manage Plan";
    return "Say Hello";
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-500 ease-out-expo overflow-hidden h-full flex flex-col",
        highlighted
          ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-lg"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md",
        isCurrentPlan && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
    >
      {/* Badge - Minimal */}
      {badge && !isCurrentPlan && (
        <div className="absolute top-0 right-0">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-bl-lg bg-primary text-primary-foreground">
            {badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 right-0">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-bl-lg bg-primary text-primary-foreground">
            <Check className="h-2.5 w-2.5" />
            Current
          </span>
        </div>
      )}

      <div className="relative p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-5">
          <h3 className={cn(
            "text-sm font-display font-bold tracking-wider uppercase mb-1",
            highlighted ? "text-primary" : "text-foreground"
          )}>
            {name}
          </h3>
          <p className={cn(
            "text-xs",
            highlighted ? "text-tertiary-foreground/60" : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-0.5">
            <span className={cn(
              "text-4xl font-display font-bold tracking-tight",
              highlighted ? "text-tertiary-foreground" : "text-foreground"
            )}>
              {price}
            </span>
            {price !== "Free" && (
              <span className={cn(
                "text-sm font-medium",
                highlighted ? "text-tertiary-foreground/50" : "text-muted-foreground"
              )}>
                {period}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-2.5 text-sm",
                highlighted ? "text-tertiary-foreground/80" : "text-foreground"
              )}
            >
              <Check className={cn(
                "h-4 w-4 flex-shrink-0 mt-0.5",
                highlighted ? "text-primary" : "text-primary"
              )} />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={highlighted ? "hero" : isCurrentPlan ? "outline" : "outline"}
          className={cn(
            "w-full",
            highlighted && "shadow-md",
            !highlighted && !isCurrentPlan && "hover:bg-primary hover:text-primary-foreground"
          )}
          size="default"
          onClick={handleClick}
          disabled={isLoading || isCurrentPlan}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
});
