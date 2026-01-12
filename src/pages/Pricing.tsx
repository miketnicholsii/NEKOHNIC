import { memo, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { Check, HelpCircle, ArrowRight, Zap, Crown, Rocket, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      <div className="absolute top-1/3 left-[20%] w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-[15%] w-40 sm:w-56 h-40 sm:h-56 bg-primary/5 rounded-full blur-3xl opacity-50" />
    </div>
  );
});

// Tier configurations with features
const tierConfigs = {
  free: {
    name: "Free",
    description: "Get started for free",
    icon: Zap,
    features: [
      "Access to learning resources",
      "Progress tracking dashboard",
      "Community support",
      "Basic guides & checklists",
    ],
  },
  starter: {
    name: "Starter",
    description: "Perfect for new entrepreneurs",
    icon: Rocket,
    features: [
      "Everything in Free",
      "Guided LLC formation walkthrough",
      "EIN application guidance",
      "Business bank account checklist",
      "Business phone & email setup",
      "Legitimacy checklist & tracker",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    description: "Build real business credit",
    icon: Crown,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Full tiered credit roadmap",
      "Vendor recommendations by tier",
      "Application guidance & templates",
      "Credit score tracking (D&B, Experian, Equifax)",
      "Tradeline management dashboard",
      "Digital CV builder",
      "Priority support",
    ],
  },
  elite: {
    name: "Elite",
    description: "Scale with advanced tools",
    icon: Sparkles,
    features: [
      "Everything in Pro",
      "Advanced credit analytics",
      "Higher-tier credit strategies",
      "Growth diagnostics & planning",
      "Digital CV Pro features",
      "Portfolio/project showcase",
      "Custom domain support",
      "Dedicated support",
    ],
  },
} as const;

const faqs = [
  {
    question: "What's the difference between monthly and annual billing?",
    answer: "Annual billing gives you 2 months free compared to monthly billing. You pay upfront for the full year at a discounted rate.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes! You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle.",
  },
  {
    question: "Is this a credit repair service?",
    answer: "No. NÈKO focuses on building business credit through legitimate means — proper business formation, vendor accounts, and responsible payment behavior. We do not repair personal credit.",
  },
  {
    question: "Do you charge for EIN filing?",
    answer: "Never. Your EIN is free directly from the IRS. We provide guidance and links to the official IRS website. Be wary of any service that charges for this.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. All plans are cancel-anytime with no long-term commitment. Cancel from your account settings and you'll retain access until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and select digital payment methods through our secure payment processor, Stripe.",
  },
];

// Tier card component
const TierCardComponent = memo(function TierCardComponent({ 
  tierKey,
  isAnnual,
  isCurrentPlan,
  onSelect,
  isLoading,
}: { 
  tierKey: SubscriptionTier;
  isAnnual: boolean;
  isCurrentPlan: boolean;
  onSelect: (tier: SubscriptionTier) => void;
  isLoading: boolean;
}) {
  const config = tierConfigs[tierKey];
  const tier = SUBSCRIPTION_TIERS[tierKey];
  const Icon = config.icon;
  const isHighlighted = tierKey === "pro";
  const isFree = tierKey === "free";
  
  const price = isFree ? 0 : isAnnual ? tier.annualPrice : tier.price;
  const period = isFree ? "" : isAnnual ? "/year" : "/month";
  const savings = isFree ? 0 : tier.price * 12 - tier.annualPrice;

  return (
    <div className={cn(
      "relative rounded-2xl border transition-all duration-500 ease-out-expo overflow-hidden h-full flex flex-col",
      isHighlighted
        ? "bg-tertiary border-tertiary text-tertiary-foreground shadow-xl scale-[1.02]"
        : "bg-card border-border hover:border-primary/30 hover:shadow-md",
      isCurrentPlan && "ring-2 ring-primary ring-offset-2 ring-offset-background"
    )}>
      {/* Badge */}
      {'badge' in config && config.badge && !isCurrentPlan && (
        <div className="absolute top-0 right-0">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-bl-lg bg-primary text-primary-foreground">
            {config.badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 right-0">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-bl-lg bg-primary text-primary-foreground">
            <Check className="h-3 w-3" />
            Current Plan
          </span>
        </div>
      )}

      <div className="relative p-6 sm:p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isHighlighted ? "bg-primary/20" : "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              isHighlighted ? "text-primary" : "text-primary"
            )} />
          </div>
          <div>
            <h3 className={cn(
              "text-lg font-display font-bold",
              isHighlighted ? "text-tertiary-foreground" : "text-foreground"
            )}>
              {config.name}
            </h3>
            <p className={cn(
              "text-xs",
              isHighlighted ? "text-tertiary-foreground/60" : "text-muted-foreground"
            )}>
              {config.description}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-4xl sm:text-5xl font-display font-bold tracking-tight",
              isHighlighted ? "text-tertiary-foreground" : "text-foreground"
            )}>
              {isFree ? "Free" : `$${price}`}
            </span>
            {!isFree && (
              <span className={cn(
                "text-sm font-medium",
                isHighlighted ? "text-tertiary-foreground/50" : "text-muted-foreground"
              )}>
                {period}
              </span>
            )}
          </div>
          {isAnnual && !isFree && savings > 0 && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              isHighlighted ? "text-primary" : "text-primary"
            )}>
              Save ${savings}/year (2 months free)
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {config.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-2.5 text-sm",
                isHighlighted ? "text-tertiary-foreground/80" : "text-foreground"
              )}
            >
              <Check className={cn(
                "h-4 w-4 flex-shrink-0 mt-0.5",
                isHighlighted ? "text-primary" : "text-primary"
              )} />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={isHighlighted ? "cta" : isCurrentPlan ? "outline" : "default"}
          className="w-full"
          disabled={isCurrentPlan || isLoading}
          onClick={() => onSelect(tierKey)}
        >
          {isCurrentPlan ? "Current Plan" : isFree ? "Get Started Free" : "Get Started"}
        </Button>
      </div>
    </div>
  );
});

const FAQItem = memo(function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  return (
    <AccordionItem 
      value={`faq-${index}`}
      className="bg-card border border-border rounded-lg px-4 sm:px-5 data-[state=open]:shadow-sm transition-shadow"
    >
      <AccordionTrigger className="text-left font-medium hover:no-underline py-3 sm:py-4 text-sm">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="pr-2">{faq.question}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 pl-6 sm:pl-7 text-xs sm:text-sm leading-relaxed">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  );
});

export default function Pricing() {
  const prefersReducedMotion = useReducedMotion();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  const handleSelectTier = async (tier: SubscriptionTier) => {
    if (tier === "free") {
      navigate("/get-started");
      return;
    }

    // For paid tiers, redirect to onboarding
    navigate("/get-started");
  };


  const tiers: SubscriptionTier[] = ["free", "starter", "pro", "elite"];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 bg-background relative">
        <HeroBackground />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span aria-hidden="true">←</span>
              Back to Home
            </Link>
            <Button asChild variant="cta" size="sm">
              <Link to="/get-started">Continue</Link>
            </Button>
          </div>
          <motion.div
            {...fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-4 sm:mb-6">
              Clear, honest pricing.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2 sm:px-0 mb-8">
              Choose what fits your journey. Upgrade, downgrade, or cancel anytime — no pressure.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3">
              <Label 
                htmlFor="billing-toggle" 
                className={cn(
                  "text-sm font-medium cursor-pointer transition-colors",
                  !isAnnual ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label 
                htmlFor="billing-toggle" 
                className={cn(
                  "text-sm font-medium cursor-pointer transition-colors flex items-center gap-2",
                  isAnnual ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Annual
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-primary text-primary-foreground">
                  Save 17%
                </span>
              </Label>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <motion.div key={tier} variants={staggerItem} className="flex">
                <TierCardComponent
                  tierKey={tier}
                  isAnnual={isAnnual}
                  isCurrentPlan={subscription.tier === tier}
                  onSelect={handleSelectTier}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Add-ons"
              title="Enhance your plan."
              description="Powerful add-ons available on any paid plan."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            <motion.div variants={staggerItem}>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-display font-bold text-foreground mb-1">Advanced Reports</h3>
                <p className="text-xs text-muted-foreground mb-3">Deep analytics & insights</p>
                <p className="text-lg font-bold text-foreground">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem}>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-display font-bold text-foreground mb-1">Credit Monitoring Setup</h3>
                <p className="text-xs text-muted-foreground mb-3">One-time expert setup</p>
                <p className="text-lg font-bold text-foreground">$149<span className="text-sm font-normal text-muted-foreground"> one-time</span></p>
              </div>
            </motion.div>
            <motion.div variants={staggerItem}>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-display font-bold text-foreground mb-1">Priority Support</h3>
                <p className="text-xs text-muted-foreground mb-3">24/7 dedicated assistance</p>
                <p className="text-lg font-bold text-foreground">$19<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              </div>
            </motion.div>
          </AnimatedStagger>

          <AnimatedSection delay={0.2}>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Add-ons can be purchased from your dashboard after subscribing to a paid plan.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="FAQ"
              title="Common questions."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
              Ready to begin?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-3 sm:mb-4">
              Start where you are.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 mb-8 sm:mb-10 max-w-md mx-auto px-2">
              You don't need to have it all figured out. We'll help you find your next step.
            </p>
            <Link to="/get-started" className="inline-block w-full sm:w-auto">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
