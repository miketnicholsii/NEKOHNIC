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
import { 
  ArrowRight, 
  Building2, 
  FileText, 
  Landmark, 
  Phone, 
  Mail,
  CheckCircle2,
  AlertCircle,
  User,
  TrendingUp,
  CreditCard,
  Globe,
  Sparkles
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
  { icon: Building2, title: "Registered Business", description: "LLC or Corporation properly filed with your state" },
  { icon: FileText, title: "EIN Number", description: "Free federal tax ID from IRS.gov" },
  { icon: Landmark, title: "Business Bank Account", description: "Separate finances from personal accounts" },
  { icon: Phone, title: "Business Phone", description: "Dedicated line for your business operations" },
  { icon: Mail, title: "Professional Email", description: "yourname@yourbusiness.com" },
];

const personalBrandBenefits = [
  "Custom public profile page with your unique URL",
  "Skills and experience showcase",
  "Link aggregation — all your work in one place",
  "SEO optimization for discoverability",
  "Professional credibility that opens doors"
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

const CheckItem = memo(function CheckItem({ item }: { item: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground">
      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
      <span className="text-sm">{item}</span>
    </li>
  );
});

const CTASection = memo(function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <AnimatedSection direction="none">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
            Ready to Begin?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
            Start where you are.
          </h2>
          <p className="text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
            You don't need to have everything figured out. We'll help you find your next step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Say Hello
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="hero-outline" size="xl">
                View Plans
              </Button>
            </Link>
          </div>
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
              How We Help
            </motion.p>
            <motion.h1 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="font-display font-bold tracking-tighter text-primary-foreground mb-6 text-[clamp(2rem,6vw,4rem)] leading-[1.1]"
            >
              A clear path forward.
            </motion.h1>
            <motion.p 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
            >
              Business infrastructure and personal branding — each with structure, guidance, and visible progress at every step.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Track Overview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedStagger className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div variants={staggerItem}>
              <a 
                href="#formation" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('formation')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg">Business Enablement</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Get set up correctly and credibly — business formation, banking, and credit building that separates from your personal score.
                </p>
                <span className="text-sm font-medium text-primary flex items-center gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <a 
                href="#brand" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('brand')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg">Personal Branding</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Build a digital presence that represents you — your story, skills, and professional credibility in one shareable page.
                </p>
                <span className="text-sm font-medium text-primary flex items-center gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </motion.div>
          </AnimatedStagger>
        </div>
      </section>

      {/* How The Tracks Work Together - Visual Diagram */}
      <section className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection direction="none">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
                Choose Your Path
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
                One track or both — your choice.
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/60 max-w-xl mx-auto">
                Each track works on its own, or combine them for a complete foundation.
              </p>
            </div>
          </AnimatedSection>

          {/* Visual Diagram */}
          <AnimatedSection delay={0.1}>
            <div className="max-w-4xl mx-auto">
              {/* Three Columns: Business | Combined | Personal */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Business Enablement Path */}
                <div className="relative">
                  <div className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 text-primary-foreground flex items-center justify-center mb-4">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-primary-foreground mb-2">
                      Business Only
                    </h3>
                    <p className="text-sm text-primary-foreground/60 mb-4">
                      Focus purely on infrastructure and credit building.
                    </p>
                    <ul className="space-y-2">
                      {["LLC Formation", "Business Banking", "Credit Building", "Vendor Accounts"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1">Businesses that already have a public face</p>
                    </div>
                  </div>
                </div>

                {/* Combined Path - Featured */}
                <div className="relative md:-mt-4 md:mb-[-16px]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-xs font-semibold text-primary-foreground z-10">
                    Recommended
                  </div>
                  <div className="p-6 rounded-2xl bg-primary-foreground/10 border-2 border-primary-foreground/20 backdrop-blur-sm h-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="text-primary-foreground/40 text-lg">+</div>
                      <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-lg text-primary-foreground mb-2 text-center">
                      Both Tracks
                    </h3>
                    <p className="text-sm text-primary-foreground/60 mb-4 text-center">
                      Complete business and personal presence together.
                    </p>
                    <ul className="space-y-2">
                      {["Everything in Business", "Digital CV & Profile", "Unified Brand Story", "Cross-Track Visibility"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide text-center">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1 text-center">Founders who are the face of their business</p>
                    </div>
                  </div>
                </div>

                {/* Personal Brand Path */}
                <div className="relative">
                  <div className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 text-primary-foreground flex items-center justify-center mb-4">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-primary-foreground mb-2">
                      Personal Only
                    </h3>
                    <p className="text-sm text-primary-foreground/60 mb-4">
                      Establish your individual digital presence.
                    </p>
                    <ul className="space-y-2">
                      {["Digital CV", "Public Profile Page", "Link Aggregation", "SEO Optimization"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1">Creators, freelancers, and professionals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Lines Visual - Desktop only */}
              <div className="hidden md:flex justify-center mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-primary-foreground/40">
                    <div className="w-8 h-px bg-primary-foreground/20" />
                    <span className="text-xs">Standalone</span>
                    <div className="w-8 h-px bg-primary-foreground/20" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex items-center gap-2 text-primary-foreground/40">
                    <div className="w-8 h-px bg-primary-foreground/20" />
                    <span className="text-xs">Standalone</span>
                    <div className="w-8 h-px bg-primary-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={0.2} className="text-center mt-12">
            <Link to="/pricing">
              <Button variant="hero" size="lg" className="group">
                Compare Plans
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Business Formation Section */}
      <section id="formation" className="py-16 sm:py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Building2 className="h-3.5 w-3.5" />
                Business Foundations
              </div>
              <SectionHeading
                title="Get set up correctly from the start."
                description="The legitimacy essentials every business needs — LLC formation, EIN, business banking, and the infrastructure that vendors, banks, and credit bureaus look for."
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
                      These aren't optional extras — they're the foundation. Every vendor, bank, and credit bureau checks these fundamentals before extending credit.
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
                Business Credit Building
              </div>
              <SectionHeading
                title="Build credit that's separate from your personal score."
                description="A structured, tier-based approach — from vendor accounts to revolving credit. Access funding that doesn't depend on your personal credit history."
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
                Personal Branding
              </div>
              <SectionHeading
                title="Your Digital CV."
                description="A professional page that tells your story, showcases your work, and builds the credibility that opens doors — whether you're building a business or establishing yourself as a professional."
              />

              <div className="mt-8 p-5 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-4">What You Get</h4>
                <ul className="space-y-3">
                  {personalBrandBenefits.map((item) => (
                    <CheckItem key={item} item={item} />
                  ))}
                </ul>
              </div>

              {/* Connection to business */}
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Standalone or supporting</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Personal branding can work independently, or it can complement and amplify your business brand — establishing you as credible alongside your company.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  to="/personal-brand" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Learn more about Digital CV
                  <ArrowRight className="h-3.5 w-3.5" />
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
