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
        "group relative p-6 sm:p-7 lg:p-8 rounded-2xl bg-card border border-border",
        "transition-all duration-500 ease-out-expo",
        "hover:border-primary/40 hover:shadow-lg hover:-translate-y-1.5",
        "focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="relative mb-5 sm:mb-6">
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
          "bg-primary/10 text-primary",
          "transition-all duration-500 ease-out-expo",
          "group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-glow group-hover:rotate-3"
        )}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg sm:text-xl font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-400">
          {title}
        </h3>
        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover accent line */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out-expo scale-x-0 group-hover:scale-x-100" 
        aria-hidden="true"
      />
    </div>
  );
});
