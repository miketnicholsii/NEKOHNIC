import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark hover:shadow-md active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
        outline:
          "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-primary/40 hover:shadow-sm active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        // NEKO premium variants
        hero: "bg-primary-foreground text-primary font-bold tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-400",
        "hero-outline":
          "border-2 border-primary-foreground/30 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/15 hover:border-primary-foreground/50 font-semibold tracking-wide backdrop-blur-md transition-all duration-400",
        cta: "bg-gradient-primary text-primary-foreground font-bold tracking-wide shadow-md hover:shadow-glow hover:scale-[1.02] active:scale-[0.99] transition-all duration-400",
        tier: "bg-accent text-accent-foreground border border-border hover:border-primary/50 hover:bg-primary-muted hover:shadow-sm active:scale-[0.98]",
        premium:
          "bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground font-bold shadow-md hover:shadow-glow animate-gradient bg-[length:200%_100%] hover:scale-[1.02] active:scale-[0.99]",
        glass:
          "bg-background/60 backdrop-blur-xl border border-border/60 text-foreground hover:bg-background/80 hover:border-primary/30 hover:shadow-md active:scale-[0.98]",
      },
      size: {
        // All sizes meet 44px minimum touch target
        default: "h-11 min-h-[44px] px-5 py-2.5",
        sm: "h-10 min-h-[44px] rounded-lg px-4 text-xs",
        lg: "h-12 min-h-[48px] rounded-xl px-8 text-base",
        xl: "h-14 min-h-[56px] rounded-2xl px-10 text-base font-bold",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-lg": "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
