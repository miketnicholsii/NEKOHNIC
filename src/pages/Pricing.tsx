import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { CheckCircle2, HelpCircle, ArrowRight, Building2, User, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      <div className="absolute top-1/3 left-[20%] w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-[15%] w-40 sm:w-56 h-40 sm:h-56 bg-primary/5 rounded-full blur-3xl opacity-50" />
    </div>
  );
});

// Business Enablement packages
const businessPackages = [
  {
    name: "Foundations",
    description: "Get set up correctly",
    price: "$29",
    period: "/month",
    features: [
      "Guided LLC formation walkthrough",
      "EIN application guidance & links",
      "Business bank account setup checklist",
      "Business phone & email setup",
      "Legitimacy checklist & tracker",
      "Progress tracking dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Foundations + Credit",
    description: "Build business credit",
    price: "$79",
    period: "/month",
    features: [
      "Everything in Foundations",
      "Full tiered credit roadmap",
      "Vendor recommendations by tier",
      "Application guidance & templates",
      "Credit score tracking (D&B, Experian, Equifax)",
      "Tradeline management dashboard",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Growth",
    description: "Scale your business",
    price: "$149",
    period: "/month",
    features: [
      "Everything in Foundations + Credit",
      "Advanced credit analytics",
      "Growth diagnostics & planning",
      "Higher-tier credit strategies",
      "Team collaboration (coming soon)",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

// Personal Branding packages
const brandingPackages = [
  {
    name: "Digital CV",
    description: "Your professional presence",
    price: "$19",
    period: "/month",
    features: [
      "Custom public profile page",
      "Unique shareable URL",
      "Skills & experience showcase",
      "Link aggregation",
      "Basic SEO optimization",
      "Professional templates",
    ],
    highlighted: false,
  },
  {
    name: "Digital CV Pro",
    description: "Stand out professionally",
    price: "$39",
    period: "/month",
    features: [
      "Everything in Digital CV",
      "Advanced customization",
      "Portfolio/project showcase",
      "Analytics & visitor insights",
      "Priority placement in directory",
      "Custom domain support",
    ],
    highlighted: true,
    badge: "Best Value",
  },
];

// Combined packages
const combinedPackage = {
  name: "Complete",
  description: "Business + Brand together",
  price: "$99",
  period: "/month",
  features: [
    "Foundations + Credit (full package)",
    "Digital CV Pro (full package)",
    "Unified dashboard experience",
    "Connected business & personal brand",
    "Priority support across all services",
    "Save $19/month vs. separate packages",
  ],
  highlighted: true,
  badge: "Best for Founders",
};

const faqs = [
  {
    question: "Can I start with just one track?",
    answer: "Absolutely. Business Enablement and Personal Branding are independent tracks. Start with what you need now, and add the other later if it makes sense for you.",
  },
  {
    question: "What's the difference between the tracks?",
    answer: "Business Enablement focuses on setting up your business correctly — formation, banking, and building business credit. Personal Branding is about your professional identity — your Digital CV, online presence, and credibility as an individual.",
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
    answer: "Yes. All plans are month-to-month with no long-term commitment. Cancel anytime from your account settings.",
  },
  {
    question: "How do the tracks work together?",
    answer: "They complement each other. Your personal brand can stand alone, or it can amplify your business — establishing you as credible alongside your company. Many founders use both.",
  },
];

// Package card component
const PackageCard = memo(function PackageCard({ 
  name, 
  description, 
  price, 
  period,
  features, 
  highlighted = false,
  badge
}: { 
  name: string; 
  description: string; 
  price: string; 
  period: string;
  features: string[]; 
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <div className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 h-full flex flex-col ${
      highlighted 
        ? "bg-card border-primary shadow-lg scale-[1.02]" 
        : "bg-card border-border hover:border-primary/30 hover:shadow-md"
    }`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
            {badge}
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="font-display font-bold text-lg text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="mb-5">
        <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground text-sm">{period}</span>
      </div>
      
      <ul className="space-y-2.5 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
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
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-background relative">
        <HeroBackground />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            {...fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-4 sm:mb-6">
              Choose your path.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2 sm:px-0">
              Start with business, brand, or both. Each track is designed to get you where you need to go.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business Enablement Track */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">Business Enablement</h2>
                <p className="text-sm text-muted-foreground">Setup, legitimacy, and credit building</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {businessPackages.map((pkg) => (
              <motion.div key={pkg.name} variants={staggerItem} className="flex">
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Personal Branding Track */}
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">Personal Branding</h2>
                <p className="text-sm text-muted-foreground">Your professional identity and presence</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {brandingPackages.map((pkg) => (
              <motion.div key={pkg.name} variants={staggerItem} className="flex">
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Combined Package */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">Both Tracks Together</h2>
                <p className="text-sm text-muted-foreground">For founders building business and personal brand</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-md mx-auto">
              <PackageCard {...combinedPackage} />
            </div>
          </AnimatedSection>

          {/* Single CTA */}
          <AnimatedSection delay={0.2}>
            <div className="text-center mt-10 sm:mt-12">
              <Link to="/contact">
                <Button variant="cta" size="lg" className="group w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                Tell us about your goals and we'll help you choose the right path
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-28 bg-muted/30">
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
              Ready?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-3 sm:mb-4">
              Let's get you set up.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 mb-8 sm:mb-10 max-w-md mx-auto px-2">
              Whether it's your business, your brand, or both — we're here to help.
            </p>
            <Link to="/contact" className="inline-block w-full sm:w-auto">
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
