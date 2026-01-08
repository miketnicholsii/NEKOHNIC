import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  User, 
  Globe,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
  Landmark
} from "lucide-react";

// Service packages - clearly defined
const businessServices = [
  { 
    icon: Building2, 
    title: "Business Foundations", 
    description: "Get set up correctly from the start — LLC formation, EIN, business banking, and the legitimacy essentials every business needs.",
    outcome: "A properly formed, credible business entity"
  },
  { 
    icon: CreditCard, 
    title: "Business Credit Building", 
    description: "Establish and grow business credit that's separate from your personal score — through vendor accounts, tradelines, and strategic credit building.",
    outcome: "Access to funding that doesn't depend on personal credit"
  },
];

const brandingServices = [
  { 
    icon: User, 
    title: "Personal Brand Identity", 
    description: "Build a digital presence that represents you — your story, skills, and professional credibility in one shareable page.",
    outcome: "A professional online presence that opens doors"
  },
  { 
    icon: Globe, 
    title: "Digital Presence", 
    description: "Whether standalone or supporting your business, establish the online visibility and credibility that modern professionals need.",
    outcome: "Visibility and credibility in your space"
  },
];

// Who we help
const audiences = [
  { label: "Freelancers & Consultants", description: "Building credibility and presence while running your practice" },
  { label: "First-Time Founders", description: "Starting a business the right way, from zero" },
  { label: "Side-Hustlers", description: "Turning your side project into a legitimate business" },
  { label: "Creators & Professionals", description: "Establishing a personal brand that stands on its own" },
];

// The problem statements
const problems = [
  "You want to start a business but don't know where to begin",
  "You've heard about business credit but don't have a clear path",
  "You need a professional presence but don't have time to figure it all out",
  "You're juggling personal and business finances without proper separation",
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated NEKO letters
const nekoLetters = [
  { char: "N", delay: 0 },
  { char: "È", delay: 0.08 },
  { char: "K", delay: 0.16 },
  { char: "O", delay: 0.24 },
];

const NekoLogo = memo(function NekoLogo() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-baseline cursor-default">
            {nekoLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: letter.delay + 0.3,
                  ease: easeOutExpo,
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  color: "hsl(168, 65%, 50%)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="inline-block neko-letter cursor-default select-none"
              >
                {letter.char}
              </motion.span>
            ))}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          sideOffset={12}
          className="bg-background/95 backdrop-blur-sm border-border/50 px-4 py-2 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <span className="text-sm font-logo tracking-wide text-foreground/80 italic">
            ē-ko
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Simplified hero background
const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/4 left-[10%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50" />
      <div className="absolute bottom-1/4 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" />
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary-foreground/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[300px] sm:w-[500px] h-[150px] sm:h-[200px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl rounded-full" />
    </div>
  );
});

// Service card component
const ServiceCard = memo(function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  outcome 
}: { 
  icon: typeof Building2; 
  title: string; 
  description: string; 
  outcome: string;
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            {outcome}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <EccentricNavbar />
      
      {/* Hero Section - Clear Positioning */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Pre-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
              className="text-xs sm:text-sm font-medium tracking-[0.25em] sm:tracking-[0.3em] uppercase text-primary-foreground/40 mb-4 sm:mb-6"
            >
              Hello
            </motion.p>
            
            {/* NEKO Logo */}
            <motion.h1 
              className="font-logo font-medium tracking-tight text-primary-foreground mb-4 sm:mb-6 text-[clamp(3rem,11vw,8rem)] leading-[0.9] neko-title"
            >
              <NekoLogo />
              <span className="neko-dot">.</span>
            </motion.h1>

            {/* ONE-SENTENCE POSITIONING STATEMENT */}
            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.5 }} className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0 font-medium">
              We help individuals and small businesses establish, grow, and manage their digital and financial presence.
            </motion.p>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.6 }} className="text-sm sm:text-base text-primary-foreground/50 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
              From business formation to credit building to personal branding — with structure, guidance, and clarity at every step.
            </motion.p>

            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">See How It Works</Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="w-5 h-8 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-1.5"
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-1 h-1.5 bg-primary-foreground/40 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30 relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                The Problem
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Starting is harder than it should be.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                You know you need to get your business set up properly. You know you should be building credit. You know your online presence matters. But the path forward isn't clear.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div 
                key={index} 
                variants={staggerItem}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{problem}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* WHY NÈKO EXISTS Section */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                Why NÈKO Exists
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Clarity, credibility, and a real path forward.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NÈKO bridges the gap between where you are and where you want to be. We provide the structure, guidance, and tools to help you establish a legitimate business presence and build the financial foundation to grow.
                </p>
                <p>
                  We work across two connected tracks: helping businesses get set up correctly and credibly, and helping individuals build a professional digital presence that represents who they are.
                </p>
              </div>
              
              {/* The transition - outcome focused */}
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">The outcome</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A properly formed business. Credit that doesn't depend on your personal score. A professional presence that opens doors. Growth on your terms.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="lg:pl-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-base sm:text-lg mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Who We Help
                </h3>
                <div className="space-y-3">
                  {audiences.map((audience, index) => (
                    <div key={audience.label} className="flex items-start gap-3 group">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-semibold text-foreground text-xs sm:text-sm transition-colors duration-200 group-hover:text-primary">{audience.label}</h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{audience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TWO TRACKS Section */}
      <section className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                How We Help
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Two tracks. One goal.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We operate across two related but independent tracks — business enablement and personal branding. Each can stand alone, or they can work together to amplify your growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Track 1: Business Enablement */}
          <div className="mb-12">
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">Business Enablement</h3>
                  <p className="text-sm text-muted-foreground">Setup, legitimacy, and financial foundation</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedStagger className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {businessServices.map((service) => (
                <motion.div key={service.title} variants={staggerItem}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </AnimatedStagger>
          </div>

          {/* Track 2: Personal Branding */}
          <div>
            <AnimatedSection direction="left" delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">Personal Branding</h3>
                  <p className="text-sm text-muted-foreground">Your professional identity and digital presence</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedStagger className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {brandingServices.map((service) => (
                <motion.div key={service.title} variants={staggerItem}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </AnimatedStagger>
          </div>

        </div>
      </section>

      {/* HOW THE TRACKS WORK TOGETHER - Visual Diagram */}
      <section className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection direction="none">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-3">
                How It Works
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
                Two paths. Your choice.
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/60 max-w-xl mx-auto">
                Choose one track, or combine them for a complete foundation.
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
                  <div className="p-5 sm:p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 text-primary-foreground flex items-center justify-center mb-4">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-primary-foreground mb-2">
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
                    <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1">Businesses that already have a public face</p>
                    </div>
                  </div>
                </div>

                {/* Combined Path - Featured */}
                <div className="relative md:-mt-3 md:mb-[-12px]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-xs font-semibold text-primary-foreground z-10">
                    Recommended
                  </div>
                  <div className="p-5 sm:p-6 rounded-2xl bg-primary-foreground/10 border-2 border-primary-foreground/20 backdrop-blur-sm h-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="text-primary-foreground/40 text-lg">+</div>
                      <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-primary-foreground mb-2 text-center">
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
                    <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide text-center">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1 text-center">Founders who are the face of their business</p>
                    </div>
                  </div>
                </div>

                {/* Personal Brand Path */}
                <div className="relative">
                  <div className="p-5 sm:p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 text-primary-foreground flex items-center justify-center mb-4">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-primary-foreground mb-2">
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
                    <div className="mt-5 pt-4 border-t border-primary-foreground/10">
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
          <AnimatedSection delay={0.2} className="text-center mt-10">
            <Link to="/pricing">
              <Button variant="hero" size="lg" className="group">
                Compare Plans
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* WHAT WORKING WITH NÈKO LOOKS LIKE Section */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="The Experience"
              title="What working with NÈKO looks like."
              description="Structure, guidance, and progress tracking at every step. No guesswork."
              centered
              className="mb-10 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Guided Setup", description: "Step-by-step guidance through business formation, banking, and legitimacy essentials." },
              { icon: CreditCard, title: "Structured Credit Path", description: "A clear roadmap through vendor accounts, tradelines, and credit building." },
              { icon: User, title: "Brand Building", description: "Your Digital CV — a professional presence that tells your story." },
              { icon: Landmark, title: "Growth Foundation", description: "The infrastructure to scale when you're ready — not before." },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                variants={staggerItem}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* CTA Section */}
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
              Whether you're starting a business, building credit, or establishing your personal brand — we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  Get Started
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">View Plans</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
