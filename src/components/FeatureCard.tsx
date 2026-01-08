import { memo } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = memo(function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-4 sm:p-5 md:p-6 rounded-xl bg-card border border-border",
        "transition-all duration-300 ease-out",
        "hover:border-primary/40 hover:shadow-md sm:hover:-translate-y-1",
        "active:scale-[0.98] sm:active:scale-100",
        className
      )}
    >
      <div className="relative mb-3 sm:mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <div className="relative">
        <h3 className="text-sm sm:text-base md:text-lg font-display font-bold mb-1.5 sm:mb-2 text-foreground group-hover:text-primary transition-colors duration-200">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-b-xl origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
});
