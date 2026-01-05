import { memo } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = memo(function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className 
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border",
        "transition-all duration-300 ease-out",
        "hover:border-primary/30 hover:shadow-md hover:-translate-y-1",
        "focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 sm:mb-5">
        <div className={cn(
          "inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl",
          "bg-primary/10 text-primary",
          "transition-all duration-300 ease-out",
          "group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105"
        )}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base sm:text-lg font-display font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover accent */}
      <div 
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" 
        aria-hidden="true"
      />
    </div>
  );
});
