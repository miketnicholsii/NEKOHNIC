import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark hover:shadow-md active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
        outline: "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-primary/40 hover:shadow-sm active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        // NEKO premium variants
        hero: "bg-primary-foreground text-primary font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-400",
        "hero-outline": "border-2 border-primary-foreground/30 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/15 hover:border-primary-foreground/50 font-semibold tracking-wide backdrop-blur-md transition-all duration-400",
        cta: "bg-gradient-primary text-primary-foreground font-bold tracking-wide shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.99] transition-all duration-400",
        tier: "bg-accent text-accent-foreground border border-border hover:border-primary/50 hover:bg-primary-muted hover:shadow-sm active:scale-[0.98]",
        premium: "bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground font-bold shadow-md hover:shadow-glow animate-gradient bg-[length:200%_100%] hover:scale-[1.02] active:scale-[0.99]",
        glass: "bg-background/60 backdrop-blur-xl border border-border/60 text-foreground hover:bg-background/80 hover:border-primary/30 hover:shadow-md active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-bold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
