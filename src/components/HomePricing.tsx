import { memo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger } from "@/components/AnimatedSection";
import { staggerCardItem } from "@/components/animated-section-variants";
import { Check, ArrowRight, Zap, Rocket, Crown, Sparkles } from "lucide-react";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

// Compact tier configurations for homepage
const tierConfigs = {
  free: {
    name: "Free",
    tagline: "Explore & learn",
    icon: Zap,
    highlights: ["Learning resources", "Progress tracking", "Community support"],
  },
  starter: {
    name: "Starter",
    tagline: "Launch your business",
    icon: Rocket,
    highlights: ["LLC formation guide", "EIN walkthrough", "Business banking checklist"],
  },
  pro: {
    name: "Pro",
    tagline: "Build real credit",
    icon: Crown,
    badge: "Popular",
    highlights: ["Full credit roadmap", "Vendor recommendations", "Digital CV builder"],
  },
  elite: {
    name: "Elite",
    tagline: "Scale with confidence",
    icon: Sparkles,
    highlights: ["Advanced analytics", "Higher-tier strategies", "Dedicated support"],
  },
} as const;

const CompactTierCard = memo(function CompactTierCard({ 
  tierKey,
  isAnnual,
}: { 
  tierKey: SubscriptionTier;
  isAnnual: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const config = tierConfigs[tierKey];
  const tier = SUBSCRIPTION_TIERS[tierKey];
  const Icon = config.icon;
  const isHighlighted = tierKey === "pro";
  const isFree = tierKey === "free";
  
  const price = isFree ? 0 : isAnnual ? Math.round(tier.annualPrice / 12) : tier.price;

  return (
    <article 
      aria-label={`${config.name} plan - ${isFree ? 'Free' : `$${price} per month`}`}
      className={cn(
        "relative rounded-xl border p-5 transition-all duration-300 h-full flex flex-col",
        isHighlighted
          ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-lg scale-[1.02]"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md",
      )}
    >
      {/* Badge */}
      {'badge' in config && config.badge && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-primary text-primary-foreground shadow-sm">
            {config.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isHighlighted ? "bg-primary/20" : "bg-primary/10"
        )}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className={cn(
            "text-sm font-display font-bold",
            isHighlighted ? "text-tertiary-foreground" : "text-foreground"
          )}>
            {config.name}
          </h3>
          <p className={cn(
            "text-[11px]",
            isHighlighted ? "text-tertiary-foreground/60" : "text-muted-foreground"
          )}>
            {config.tagline}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-0.5">
          <span className={cn(
            "text-2xl font-display font-bold tracking-tight",
            isHighlighted ? "text-tertiary-foreground" : "text-foreground"
          )}>
            {isFree ? "Free" : `$${price}`}
          </span>
          {!isFree && (
            <span className={cn(
              "text-xs font-medium",
              isHighlighted ? "text-tertiary-foreground/50" : "text-muted-foreground"
            )}>
              /mo
            </span>
          )}
        </div>
        {isAnnual && !isFree && (
          <p className="text-[10px] text-primary font-medium mt-0.5">
            Billed annually
          </p>
        )}
      </div>

      {/* Key Features */}
      <ul className="space-y-1.5 flex-1 mb-4" role="list" aria-label={`${config.name} plan features`}>
        {config.highlights.map((feature, index) => (
          <li
            key={index}
            className={cn(
              "flex items-start gap-2 text-xs",
              isHighlighted ? "text-tertiary-foreground/80" : "text-muted-foreground"
            )}
          >
            <Check className="h-3 w-3 flex-shrink-0 mt-0.5 text-primary" aria-hidden="true" />
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
});

export const HomePricing = memo(function HomePricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const tiers: SubscriptionTier[] = ["free", "starter", "pro", "elite"];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-muted/30 relative" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3" aria-hidden="true">
              Simple Pricing
            </p>
            <h2 id="pricing-heading" className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              Pick what fits your journey.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6">
              Start free, upgrade when ready. Cancel anytime.
            </p>

            {/* Billing Toggle - Pill Style */}
            <fieldset className="inline-flex items-center gap-1.5 p-1 rounded-full bg-muted/60 border border-border">
              <legend className="sr-only">Choose billing period</legend>
              <button
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300",
                  !isAnnual 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5",
                  isAnnual 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
                <span 
                  id="billing-savings"
                  className={cn(
                    "px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded-full transition-colors",
                    isAnnual ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
                  )}
                >
                  -17%
                </span>
              </button>
            </fieldset>
          </div>
        </AnimatedSection>

        {/* Pricing Cards - Compact Grid */}
        <AnimatedStagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto" staggerDelay={0.08}>
          {tiers.map((tier) => (
            <motion.div key={tier} variants={staggerCardItem} className="flex">
              <CompactTierCard
                tierKey={tier}
                isAnnual={isAnnual}
              />
            </motion.div>
          ))}
        </AnimatedStagger>

        {/* CTA */}
        <AnimatedSection delay={0.2} className="text-center mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/get-started">
              <Button variant="cta" size="default" className="group" aria-label="Get started with a free account">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Compare all features →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});
