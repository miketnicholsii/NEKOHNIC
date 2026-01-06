import { memo } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export const SectionHeading = memo(function SectionHeading({
  label,
  title,
  description,
  centered = false,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {label && (
        <span 
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-4 sm:mb-5",
            light ? "text-primary/80" : "text-primary"
          )}
        >
          <span className="w-6 h-px bg-current opacity-50" aria-hidden="true" />
          {label}
          {centered && <span className="w-6 h-px bg-current opacity-50" aria-hidden="true" />}
        </span>
      )}
      <h2 
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold tracking-tighter mb-4 sm:mb-5",
          light ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p 
          className={cn(
            "text-base sm:text-lg max-w-2xl leading-relaxed",
            centered && "mx-auto",
            light ? "text-primary-foreground/60" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
});
