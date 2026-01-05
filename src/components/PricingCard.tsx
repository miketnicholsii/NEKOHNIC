import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SUBSCRIPTION_TIERS, SubscriptionTier, tierMeetsRequirement } from "@/lib/subscription-tiers";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  className?: string;
}

export function PricingCard({
  name,
  description,
  price,
  period = "/month",
  features,
  highlighted = false,
  badge,
  ctaText = "Get Started",
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
    // Free tier - just go to signup
    if (tierKey === "free") {
      if (user) {
        navigate("/app");
      } else {
        navigate("/signup");
      }
      return;
    }

    // Not logged in - go to signup
    if (!user) {
      navigate("/signup");
      return;
    }

    // Already on this plan
    if (isCurrentPlan) {
      navigate("/app");
      return;
    }

    // Downgrade or manage - go to customer portal (if they have a subscription)
    if (subscription.subscribed) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("customer-portal");
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, "_blank");
        }
      } catch (error) {
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

    // Create checkout session
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: tierKey },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
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
    return ctaText;
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-500",
        highlighted
          ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-lg scale-[1.02]"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md",
        isCurrentPlan && "ring-2 ring-primary",
        className
      )}
    >
      {/* Badge */}
      {badge && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary text-primary-foreground">
            {badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary text-primary-foreground">
            Your Plan
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className={cn(
            "text-lg font-display font-bold tracking-wide uppercase mb-2",
            highlighted ? "text-primary" : "text-foreground"
          )}>
            {name}
          </h3>
          <p className={cn(
            "text-sm",
            highlighted ? "text-tertiary-foreground/70" : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-4xl font-display font-bold",
              highlighted ? "text-tertiary-foreground" : "text-foreground"
            )}>
              {price}
            </span>
            {price !== "Free" && (
              <span className={cn(
                "text-sm",
                highlighted ? "text-tertiary-foreground/60" : "text-muted-foreground"
              )}>
                {period}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 text-sm",
                highlighted ? "text-tertiary-foreground/90" : "text-foreground"
              )}
            >
              <Check
                className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  highlighted ? "text-primary" : "text-primary"
                )}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={highlighted ? "hero" : isCurrentPlan ? "outline" : "outline"}
          className={cn("w-full", highlighted && "shadow-md")}
          size="lg"
          onClick={handleClick}
          disabled={isLoading || isCurrentPlan}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
