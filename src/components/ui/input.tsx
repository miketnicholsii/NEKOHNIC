import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles with proper touch target
          "flex h-11 min-h-[44px] w-full rounded-xl border border-input bg-background px-4 py-2.5",
          // Typography
          "text-base ring-offset-background placeholder:text-muted-foreground",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Focus states with visible ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Responsive text size
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
