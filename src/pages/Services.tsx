import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionNav } from "@/components/SectionNav";
import { TierCard } from "@/components/TierCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { BusinessStarterPreview } from "@/components/previews/BusinessStarterPreview";
import { BusinessCreditPreview } from "@/components/previews/BusinessCreditPreview";
import { PersonalBrandPreview } from "@/components/previews/PersonalBrandPreview";
import { DashboardPreview } from "@/components/previews/DashboardPreview";
import { 
  ArrowRight, 
  Building2, 
  FileText, 
  Landmark, 
  Phone, 
  Mail,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  User,
  TrendingUp,
  CreditCard
} from "lucide-react";

const creditTiers = [
  {
    tier: 0,
    title: "Business Readiness",
    description: "Establish the foundation before building credit",
    features: [
      "Registered LLC or Corporation",
      "EIN from the IRS",
      "Business bank account",
      "Dedicated business phone",
      "Professional business email",
    ],
    status: "unlocked" as const,
  },
  {
    tier: 1,
    title: "Net-30 Vendors",
    description: "Build trade references with vendor accounts",
    features: [
      "Vendor accounts (Uline, Quill, Grainger)",
      "Net-30 payment terms",
      "Reports to business credit bureaus",
      "Build payment history",
      "No personal guarantee required",
    ],
    status: "locked" as const,
  },
  {
    tier: 2,
    title: "Store Credit",
    description: "Graduate to retail and store credit cards",
    features: [
      "Home Depot, Lowes, Staples",
      "Office supply store credit",
      "Revolving credit lines",
      "Higher credit limits",
      "Continued bureau reporting",
    ],
    status: "locked" as const,
  },
  {
    tier: 3,
    title: "Revolving Credit",
    description: "Access business credit cards and lines of credit",
    features: [
      "Business credit cards",
      "Lines of credit",
      "Higher credit limits",
      "Cash back and rewards",
      "Flexible payment options",
    ],
    status: "locked" as const,
  },
];

const legitimacySteps = [
  { icon: Building2, title: "Registered Business", description: "LLC or Corporation properly filed" },
  { icon: FileText, title: "EIN Number", description: "Free from IRS.gov" },
  { icon: Landmark, title: "Business Bank Account", description: "Separate from personal" },
  { icon: Phone, title: "Business Phone", description: "Dedicated line for your business" },
  { icon: Mail, title: "Professional Email", description: "yourname@yourbusiness.com" },
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/4 left-[10%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/3 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-50" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" />
    </div>
  );
});

// Simple list item with CSS animation
const ListItem = memo(function ListItem({ 
  step, 
  index 
}: { 
  step: typeof legitimacySteps[0]; 
  index: number;
}) {
  return (
    <div 
      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors duration-200"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <step.icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium text-foreground">{step.title}</h4>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    </div>
  );
});

// Simple check item
const CheckItem = memo(function CheckItem({ item }: { item: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground">
      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
      <span className="text-sm">{item}</span>
    </li>
  );
});

// CTA Section simplified
const CTASection = memo(function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <AnimatedSection direction="none">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
            Hello, NÈKO.
          </h2>
          <p className="text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
            Ready to start? All you have to do is say hello.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl" className="group">
              Say Hello
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
});

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 20 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />
      <SectionNav />

      {/* Hero */}
      <section className="relative min-h-[70svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.p 
              {...fadeIn}
              className="text-sm font-medium tracking-widest uppercase text-primary-foreground/50 mb-4"
            >
              Services
            </motion.p>
            <motion.h1 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="font-display font-bold tracking-tighter text-primary-foreground mb-6 text-[clamp(2rem,6vw,4rem)] leading-[1.1]"
            >
              The path forward.
            </motion.h1>
            <motion.p 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
            >
              From formation to credit to brand. Each step structured, trackable, and designed for sustainable progress.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 sm:py-20 lg:py-28 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="none">
            <div className="text-center mb-10">
              <SectionHeading
                label="Your Dashboard"
                title="Everything in one place."
                description="A personalized command center for your business journey. Track progress, manage tasks, and stay focused."
                centered
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} direction="up">
            <div className="max-w-4xl mx-auto">
              <DashboardPreview />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Business Starter Flow */}
      <section id="formation" className="py-16 sm:py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Building2 className="h-3.5 w-3.5" />
                Start
              </div>
              <SectionHeading
                title="Business Formation"
                description="The foundation. A guided path to properly form your business and establish legitimacy from day one."
              />

              <div className="mt-8 space-y-3">
                {legitimacySteps.map((step, index) => (
                  <ListItem key={step.title} step={step} index={index} />
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Why this matters</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Every vendor, bank, and credit bureau checks these fundamentals. Get them right from the start.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <BusinessStarterPreview />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Business Credit Section */}
      <section id="credit" className="py-16 sm:py-20 lg:py-28 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="none">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <TrendingUp className="h-3.5 w-3.5" />
                Build
              </div>
              <SectionHeading
                title="Business Credit"
                description="A structured, tier-based approach to building business credit that separates from your personal score."
                centered
              />
            </div>
          </AnimatedSection>

          {/* Tier Cards */}
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {creditTiers.map((tier) => (
              <motion.div key={tier.tier} variants={staggerItem}>
                <TierCard {...tier} />
              </motion.div>
            ))}
          </AnimatedStagger>

          {/* Credit Preview */}
          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <BusinessCreditPreview />
            </div>
          </AnimatedSection>

          {/* What You Get */}
          <AnimatedSection delay={0.3} className="mt-12">
            <div className="max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    "Vendor recommendations at each tier",
                    "Application guidance and templates",
                    "Score tracking across bureaus",
                    "Tradeline management dashboard",
                    "Step-by-step progression path"
                  ].map((item) => (
                    <CheckItem key={item} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Personal Brand Section */}
      <section id="brand" className="py-16 sm:py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimatedSection direction="left" className="lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <User className="h-3.5 w-3.5" />
                Brand
              </div>
              <SectionHeading
                title="Personal Brand"
                description="Your Digital CV. A professional page that tells your story, showcases your work, and builds credibility."
              />

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h4 className="font-medium text-foreground mb-2">What You Get</h4>
                  <ul className="space-y-2">
                    {[
                      "Custom public profile page",
                      "Skills and experience showcase",
                      "Link aggregation",
                      "SEO optimization",
                      "Shareable URL"
                    ].map((item) => (
                      <CheckItem key={item} item={item} />
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/personal-brand" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Learn more about Digital CV
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="lg:order-1">
              <PersonalBrandPreview />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </main>
  );
}