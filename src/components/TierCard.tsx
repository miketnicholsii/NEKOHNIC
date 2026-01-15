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

const getTierColor = (tier: number) => {
  switch (tier) {
    case 0: return "bg-tier-0";
    case 1: return "bg-tier-1";
    case 2: return "bg-tier-2";
    case 3: return "bg-tier-3";
    default: return "bg-tier-0";
  }
};

const getTierBgColor = (tier: number) => {
  switch (tier) {
    case 0: return "bg-tier-0/20 text-muted-foreground";
    case 1: return "bg-tier-1/20 text-primary";
    case 2: return "bg-tier-2/20 text-amber-600";
    case 3: return "bg-tier-3/20 text-secondary";
    default: return "bg-tier-0/20 text-muted-foreground";
  }
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
    <article
      aria-label={`${title} tier - ${status === 'locked' ? 'Locked' : status === 'current' ? `Current tier, ${progress}% complete` : 'Unlocked'}`}
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
        role="progressbar"
        aria-label={`Tier ${tier} progress`}
        aria-valuenow={isCurrent ? progress : status === "unlocked" ? 100 : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5",
          getTierColor(tier)
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
                    : getTierBgColor(tier)
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
          {isLocked && <Lock className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />}
          {status === "unlocked" && <Check className="h-5 w-5 text-primary" aria-label="Completed" />}
        </div>

        {/* Description */}
        <p className={cn("text-sm mb-6", isLocked ? "text-muted-foreground/50" : "text-muted-foreground")}>
          {description}
        </p>

        {/* Progress bar for current tier */}
        {isCurrent && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground" id={`tier-${tier}-progress-label`}>Progress</span>
              <span className="font-medium text-foreground" aria-hidden="true">{progress}%</span>
            </div>
            <div 
              className="h-2 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-labelledby={`tier-${tier}-progress-label`}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={cn("h-full rounded-full transition-all duration-500", getTierColor(tier))}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        <ul className="space-y-3 mb-6" role="list" aria-label={`${title} tier features`}>
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
                aria-hidden="true"
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
            aria-label={isCurrent ? `Continue progress on ${title} tier` : `View details for ${title} tier`}
          >
            {isCurrent ? "Continue Progress" : "View Details"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </article>
  );
}
