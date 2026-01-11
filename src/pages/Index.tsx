import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionIndicator, MobileProgressBar } from "@/components/SectionIndicator";
import { AnimatedSection, AnimatedStagger, staggerItem, staggerCardItem } from "@/components/AnimatedSection";
import { HomePricing } from "@/components/HomePricing";
import { DashboardPreview } from "@/components/previews/DashboardPreview";
import { BusinessCreditPreview } from "@/components/previews/BusinessCreditPreview";
import { PersonalBrandPreview } from "@/components/previews/PersonalBrandPreview";
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

// Common starting points - framed positively
const startingPoints = [
  "You have a business idea and want to do it right from the start",
  "You're ready to build business credit on your own terms",
  "You want a professional presence that truly represents you",
  "You're ready to separate personal and business finances properly",
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Simplified NEKO logo - no complex per-letter animations or tooltips
const NekoLogo = memo(function NekoLogo() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
      className="inline-block cursor-default select-none"
      title="NÈKO - pronounced 'ē-ko'"
    >
      NÈKO
    </motion.span>
  );
});

// Parallax hero background with subtle scroll effects
const HeroBackground = memo(function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Parallax transforms - subtle movement relative to scroll
  // Each element moves at a different rate for depth effect
  const y1 = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : -60]);
  const y3 = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : 40]);
  const opacity = useTransform(scrollY, [0, 400], [1, prefersReducedMotion ? 1 : 0.3]);
  const scale = useTransform(scrollY, [0, 500], [1, prefersReducedMotion ? 1 : 1.1]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left glow orb - moves down slowly */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute top-1/4 left-[10%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50" 
      />
      
      {/* Bottom-right glow orb - moves up */}
      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-1/4 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50" 
      />
      
      {/* Outer ring - scales slightly */}
      <motion.div 
        style={{ scale, opacity }}
        className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" 
      />
      
      {/* Inner ring - moves down slowly */}
      <motion.div 
        style={{ y: y3, opacity }}
        className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary-foreground/5 rounded-full" 
      />
      
      {/* Center glow - fades out */}
      <motion.div 
        style={{ opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[300px] sm:w-[500px] h-[150px] sm:h-[200px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl rounded-full" 
      />
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
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="group p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-2 transition-colors duration-200 group-hover:text-primary">{title}</h3>
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
    <main className="min-h-screen overflow-x-hidden pb-16 lg:pb-0">
      <EccentricNavbar />
      <SectionIndicator />
      <MobileProgressBar />
      
      {/* Hero Section - Clear Positioning */}
      <section id="hero" className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
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
              A calm, guided way to start and grow your business — with clarity at every step.
            </motion.p>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.6 }} className="text-sm sm:text-base text-primary-foreground/50 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
              Business formation. Credit building. Personal branding. We help you take the next right step.
            </motion.p>

            {/* Single exploration-focused CTA - scroll to services */}
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.7 }} className="flex flex-col items-center gap-4 px-4 sm:px-0">
              <a 
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Button variant="hero-outline" size="lg" className="group">
                  <span className="flex items-center gap-2">
                    See What We Offer
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </a>
              <p className="text-xs sm:text-sm text-primary-foreground/40">
                Business formation · Credit building · Personal branding
              </p>
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

      {/* WHERE YOU ARE Section - Positive framing */}
      <section id="starting-points" className="py-12 sm:py-16 lg:py-24 bg-muted/30 relative scroll-mt-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                Sound Familiar?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                You're ready. You just need the path.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Starting a business doesn't have to feel overwhelming. When you know the next right step, everything gets clearer.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {startingPoints.map((point, index) => (
              <motion.div 
                key={index} 
                variants={staggerItem}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* WHY NÈKO EXISTS Section */}
      <section id="how-we-help" className="py-12 sm:py-16 lg:py-28 bg-background relative scroll-mt-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                How We Help
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Your guide from idea to credibility.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Think of NÈKO as a thoughtful guide sitting beside you — helping you understand where you are, what comes next, and how to move forward with confidence.
                </p>
                <p>
                  We work across two tracks: business infrastructure (formation, banking, credit building) and personal presence (your professional identity online). Use one or both — we meet you where you are.
                </p>
              </div>
              
              {/* The transition - outcome focused */}
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">What you'll walk away with</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A properly formed business. Credit that grows on its own. A professional presence that opens doors. Peace of mind.
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

      {/* TWO TRACKS Section - now with id="services" for nav anchor */}
      <section id="services" className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative scroll-mt-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                What We Offer
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
            
            <AnimatedStagger className="grid md:grid-cols-2 gap-4 sm:gap-5" staggerDelay={0.12}>
              {businessServices.map((service) => (
                <motion.div key={service.title} variants={staggerCardItem}>
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
            
            <AnimatedStagger className="grid md:grid-cols-2 gap-4 sm:gap-5" staggerDelay={0.12}>
              {brandingServices.map((service) => (
                <motion.div key={service.title} variants={staggerCardItem}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </AnimatedStagger>
          </div>

        </div>
      </section>

      {/* HOW THE TRACKS WORK TOGETHER - Visual Diagram */}
      <section id="paths" className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden scroll-mt-20">
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

          {/* CTA to services detail page */}
          <AnimatedSection delay={0.2} className="text-center mt-10">
            <Link to="/services" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
              See detailed breakdown <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* PRICING Section - Integrated for seamless flow */}
      <HomePricing />

      {/* WHAT WORKING WITH NÈKO LOOKS LIKE Section */}
      <section id="experience" className="py-12 sm:py-16 lg:py-28 bg-background relative scroll-mt-20">
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

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto" staggerDelay={0.1}>
            {[
              { icon: Shield, title: "Guided Setup", description: "Step-by-step guidance through business formation, banking, and legitimacy essentials." },
              { icon: CreditCard, title: "Structured Credit Path", description: "A clear roadmap through vendor accounts, tradelines, and credit building." },
              { icon: User, title: "Brand Building", description: "Your Digital CV — a professional presence that tells your story." },
              { icon: Landmark, title: "Growth Foundation", description: "The infrastructure to scale when you're ready — not before." },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                variants={staggerCardItem}
                className="group p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* PRODUCT DEMOS Section - Interactive previews */}
      <section id="demos" className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative scroll-mt-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-[5%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <SectionHeading
              label="See It In Action"
              title="Explore what you'll get."
              description="Click on any preview to see the full interactive demo. These are real examples of what your dashboard experience looks like."
              centered
              className="mb-10 sm:mb-14"
            />
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <AnimatedSection direction="left" delay={0}>
              <DashboardPreview />
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center mt-5"
              >
                <p className="font-display font-bold text-foreground">Your Dashboard</p>
                <p className="text-sm text-muted-foreground mt-1">Track progress, manage tasks, and see your journey at a glance.</p>
              </motion.div>
            </AnimatedSection>
            
            <AnimatedSection direction="none" delay={0.1}>
              <BusinessCreditPreview />
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center mt-5"
              >
                <p className="font-display font-bold text-foreground">Credit Builder</p>
                <p className="text-sm text-muted-foreground mt-1">Build business credit through vendor accounts and tradelines.</p>
              </motion.div>
            </AnimatedSection>
            
            <AnimatedSection direction="right" delay={0.2}>
              <PersonalBrandPreview />
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center mt-5"
              >
                <p className="font-display font-bold text-foreground">Personal Brand</p>
                <p className="text-sm text-muted-foreground mt-1">Create your professional Digital CV and online presence.</p>
              </motion.div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3} className="text-center mt-12 sm:mt-14">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground mb-5"
            >
              Click any preview above to see the full interactive demo
            </motion.p>
            <Link to="/get-started">
              <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20">
                Start Building Today
                <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden scroll-mt-20">
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
              <Link to="/get-started" className="w-full sm:w-auto">
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
