import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 lg:p-8 rounded-2xl bg-card border border-border transition-all duration-500 hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover accent */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
    </div>
  );
}
