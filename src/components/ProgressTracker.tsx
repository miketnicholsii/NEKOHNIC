import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming" | "locked";
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  className?: string;
  variant?: "horizontal" | "vertical";
}

export function ProgressTracker({ steps, className, variant = "vertical" }: ProgressTrackerProps) {
  const getStatusStyles = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-primary text-primary-foreground border-primary",
          line: "bg-primary",
          text: "text-foreground",
        };
      case "current":
        return {
          circle: "bg-primary/10 text-primary border-primary animate-pulse-soft",
          line: "bg-border",
          text: "text-foreground font-semibold",
        };
      case "upcoming":
        return {
          circle: "bg-muted text-muted-foreground border-border",
          line: "bg-border",
          text: "text-muted-foreground",
        };
      case "locked":
        return {
          circle: "bg-muted/50 text-muted-foreground/50 border-border/50",
          line: "bg-border/50",
          text: "text-muted-foreground/50",
        };
    }
  };

  const getIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "locked":
        return <Lock className="h-3 w-3" />;
      default:
        return <Circle className="h-2 w-2 fill-current" />;
    }
  };

  if (variant === "horizontal") {
    return (
      <div className={cn("flex items-start justify-between", className)}>
        {steps.map((step, index) => {
          const styles = getStatusStyles(step.status);
          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-1/2 w-full h-0.5",
                    styles.line
                  )}
                />
              )}
              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  styles.circle
                )}
              >
                {getIcon(step.status)}
              </div>
              {/* Content */}
              <div className="mt-4 text-center px-2">
                <p className={cn("text-sm font-medium", styles.text)}>{step.title}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const styles = getStatusStyles(step.status);
        return (
          <div key={step.id} className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  styles.circle
                )}
              >
                {getIcon(step.status)}
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-0.5 flex-1 min-h-[60px]", styles.line)} />
              )}
            </div>
            {/* Content */}
            <div className="pb-8 pt-2">
              <p className={cn("text-base", styles.text)}>{step.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
