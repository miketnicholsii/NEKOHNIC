import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, Sparkles } from "lucide-react";
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
  ctaText?: string;
  className?: string;
}

export const PricingCard = memo(function PricingCard({
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
    if (tierKey === "free") {
      if (user) {
        navigate("/app");
      } else {
        navigate("/signup");
      }
      return;
    }

    if (!user) {
      navigate("/signup");
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: tierKey },
      });
      
      if (error) throw error;
      
      if (data?.url) {
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
    return ctaText;
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border transition-all duration-500 ease-out-expo overflow-hidden",
        highlighted
          ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-xl scale-[1.02] z-10"
          : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
        isCurrentPlan && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
    >
      {/* Gradient overlay for highlighted */}
      {highlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
      )}

      {/* Badge */}
      {badge && !isCurrentPlan && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-b-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-3 w-3" />
            {badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-b-xl bg-primary text-primary-foreground">
            <Check className="h-3 w-3" />
            Your Plan
          </span>
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className={cn(
            "text-sm font-display font-bold tracking-wider uppercase mb-2",
            highlighted ? "text-primary" : "text-foreground"
          )}>
            {name}
          </h3>
          <p className={cn(
            "text-sm",
            highlighted ? "text-tertiary-foreground/60" : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-5xl font-display font-bold tracking-tight",
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
        <ul className="space-y-3.5 mb-8">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 text-sm",
                highlighted ? "text-tertiary-foreground/80" : "text-foreground"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                highlighted ? "bg-primary/20" : "bg-primary/10"
              )}>
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={highlighted ? "hero" : isCurrentPlan ? "outline" : "cta"}
          className={cn(
            "w-full",
            highlighted && "shadow-lg hover:shadow-xl",
            !highlighted && !isCurrentPlan && "bg-primary hover:bg-primary-dark"
          )}
          size="lg"
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
