import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeading({
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
        <span className={cn(
          "inline-block text-xs font-semibold tracking-wide uppercase mb-4",
          light ? "text-primary" : "text-primary"
        )}>
          {label}
        </span>
      )}
      <h2 className={cn(
        "text-3xl lg:text-4xl xl:text-5xl font-display font-bold tracking-tightest mb-4",
        light ? "text-primary-foreground" : "text-foreground"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-lg max-w-2xl",
          centered && "mx-auto",
          light ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
