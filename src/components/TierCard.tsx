import { cn } from "@/lib/utils";
import { Check, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TierCardProps {
  tier: number;
  title: string;
  description: string;
  features: string[];
  status: "unlocked" | "current" | "locked";
  progress?: number;
  className?: string;
}

const tierColors = {
  0: "tier-0",
  1: "tier-1", 
  2: "tier-2",
  3: "tier-3",
};

export function TierCard({
  tier,
  title,
  description,
  features,
  status,
  progress = 0,
  className,
}: TierCardProps) {
  const isLocked = status === "locked";
  const isCurrent = status === "current";
  
  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-500 overflow-hidden",
        isLocked
          ? "bg-muted/30 border-border/50 opacity-60"
          : isCurrent
          ? "bg-card border-primary shadow-glow"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      {/* Tier indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5",
          `bg-tier-${tier}`
        )}
        style={{ width: isCurrent ? `${progress}%` : status === "unlocked" ? "100%" : "0%" }}
      />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                  isLocked
                    ? "bg-muted text-muted-foreground"
                    : `bg-tier-${tier}/20 text-tier-${tier}`
                )}
              >
                {tier}
              </span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tier {tier}
              </span>
            </div>
            <h3 className={cn("text-xl font-display font-bold", isLocked && "text-muted-foreground")}>
              {title}
            </h3>
          </div>
          {isLocked && <Lock className="h-5 w-5 text-muted-foreground/50" />}
          {status === "unlocked" && <Check className="h-5 w-5 text-primary" />}
        </div>

        {/* Description */}
        <p className={cn("text-sm mb-6", isLocked ? "text-muted-foreground/50" : "text-muted-foreground")}>
          {description}
        </p>

        {/* Progress bar for current tier */}
        {isCurrent && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", `bg-tier-${tier}`)}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 text-sm",
                isLocked ? "text-muted-foreground/50" : "text-foreground"
              )}
            >
              <Check
                className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  isLocked ? "text-muted-foreground/30" : "text-primary"
                )}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        {!isLocked && (
          <Button
            variant={isCurrent ? "cta" : "tier"}
            className="w-full group"
          >
            {isCurrent ? "Continue Progress" : "View Details"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
