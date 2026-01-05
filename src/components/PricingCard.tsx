import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-500",
        highlighted
          ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-lg scale-[1.02]"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary text-primary-foreground">
            {badge}
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
        <Link to="/get-started">
          <Button
            variant={highlighted ? "hero" : "outline"}
            className={cn("w-full", highlighted && "shadow-md")}
            size="lg"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
