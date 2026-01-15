import { lazy, memo, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionIndicator, MobileProgressBar } from "@/components/SectionIndicator";
import { AnimatedSection, AnimatedStagger } from "@/components/AnimatedSection";
import { staggerCardItem, staggerItem } from "@/components/animated-section-variants";
import { HomePricing } from "@/components/HomePricing";
import { LazyMount } from "@/components/LazyMount";
import { PreviewErrorBoundary } from "@/components/previews/PreviewErrorBoundary";
import { PreviewPlaceholder } from "@/components/previews/PreviewPlaceholder";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Landmark,
  FileCheck,
  BarChart3,
  Wallet,
  Users
} from "lucide-react";

const DashboardPreview = lazy(() =>
  import("@/components/previews/DashboardPreview").then((module) => ({
    default: module.DashboardPreview,
  }))
);
const BusinessCreditPreview = lazy(() =>
  import("@/components/previews/BusinessCreditPreview").then((module) => ({
    default: module.BusinessCreditPreview,
  }))
);
const PersonalBrandPreview = lazy(() =>
  import("@/components/previews/PersonalBrandPreview").then((module) => ({
    default: module.PersonalBrandPreview,
  }))
);

// Service packages with real business credit terminology
const businessServices = [
  { 
    icon: Building2, 
    title: "Business Formation & Compliance", 
    description: "Establish your LLC with proper articles of organization, obtain your EIN, and set up a dedicated business bank account. Create the legal separation required for business credit eligibility.",
    outcome: "A fundable business entity with proper documentation"
  },
  { 
    icon: CreditCard, 
    title: "Business Credit Profile Building", 
    description: "Build tradelines with net-30 vendor accounts that report to Dun & Bradstreet, Experian Business, and Equifax Business. Establish payment history and utilization patterns that signal creditworthiness.",
    outcome: "Measurable business credit scores independent of personal credit"
  },
  { 
    icon: FileCheck, 
    title: "Fundability Readiness", 
    description: "Prepare your business for underwriting review. We help you build the 'fundability signals' lenders look for: consistent revenue documentation, proper business filings, and compliance history.",
    outcome: "Documentation ready for working capital and term loan applications"
  },
  { 
    icon: BarChart3, 
    title: "Credit Monitoring & Strategy", 
    description: "Track your Paydex score, D&B rating, and business credit utilization. Get strategic recommendations for credit limit increases and new tradeline opportunities.",
    outcome: "Ongoing visibility into your business credit health"
  },
];

const brandingServices = [
  { 
    icon: User, 
    title: "Professional Digital Identity", 
    description: "Build a Digital CV that showcases your expertise, accomplishments, and professional story. Create a credible online presence that works whether you're pitching clients or seeking partnerships.",
    outcome: "A professional landing page that opens doors"
  },
  { 
    icon: Globe, 
    title: "Online Presence & Visibility", 
    description: "Consolidate your professional links, portfolio, and social proof in one shareable page. Optimize for discoverability and make a strong first impression.",
    outcome: "Unified online presence with SEO optimization"
  },
];

// Who we help with specific use cases
const audiences = [
  { label: "First-Time Founders", description: "Form your LLC correctly and build business credit from day one" },
  { label: "Side-Hustlers Going Full-Time", description: "Transition from hobby to legitimate business entity" },
  { label: "Service Professionals", description: "Freelancers, consultants, and contractors building credibility" },
  { label: "Credit Rebuilders", description: "Separate business finances from personal credit challenges" },
];

// Common starting points - reframed with business credit language
const startingPoints = [
  "You're ready to form an LLC but want to do it right for future funding",
  "You want business credit that's separate from your personal score",
  "You're preparing for working capital or term loan applications",
  "You need a professional online presence that builds trust",
];

// FAQ data with real business credit/fintech content
const faqItems = [
  {
    question: "What's the difference between personal and business credit?",
    answer: "Personal credit (your FICO score) is tied to your SSN and reflects your individual borrowing history. Business credit is tied to your EIN and reflects your company's payment history with vendors and lenders. Building business credit allows you to access funding, vendor terms, and credit lines without personally guaranteeing every transaction or impacting your personal credit utilization."
  },
  {
    question: "How long does it take to build business credit?",
    answer: "With consistent effort, you can establish initial tradelines and a Paydex score within 60-90 days. Building a strong business credit profile that qualifies for significant credit lines typically takes 6-12 months of positive payment history. We guide you through each step with realistic timelines."
  },
  {
    question: "Do I need an existing business to start?",
    answer: "No. Many of our members start from zero. Our Business Starter flow guides you through LLC formation, EIN registration, and business banking setup—the foundational elements required before you can begin building business credit."
  },
  {
    question: "What are 'net-30 vendor accounts' and why do they matter?",
    answer: "Net-30 vendors extend 30-day payment terms on purchases and report your payment history to business credit bureaus (D&B, Experian Business, Equifax Business). These tradelines are the building blocks of your business credit profile. We recommend vendors known to approve new businesses and report consistently."
  },
  {
    question: "Will this affect my personal credit score?",
    answer: "Business credit building, when done correctly, operates independently of your personal credit. We focus on vendor accounts and business credit cards that report only to business bureaus. The goal is to create a credit profile for your business entity, not add to your personal debt load."
  },
  {
    question: "What do I actually get when I sign up?",
    answer: "You get structured, step-by-step guidance through business formation, credit building, and/or personal branding. This includes checklists, vendor recommendations, progress tracking, and a dashboard to monitor your journey. Higher tiers include expanded features like tradeline tracking, credit score monitoring, and the Digital CV builder."
  },
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Premium NEKO logo component with enhanced styling
const NekoLogo = memo(function NekoLogo() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
      className="inline-block cursor-default select-none relative"
      title="NÈKO - pronounced 'neh-ko'"
    >
      <span className="relative">
        N
        <motion.span 
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: easeOutExpo }}
        />
      </span>
      ÈKO
    </motion.span>
  );
});

// Clean, minimal hero background with subtle gradients
const HeroBackground = memo(function HeroBackground({ reduceMotion }: { reduceMotion: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const shouldReduceMotion = prefersReducedMotion || reduceMotion;
  
  // Subtle parallax effects
  const opacity = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0.3]);
  const yShift = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 100]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Clean gradient base */}
      <motion.div 
        style={{ opacity, y: yShift }}
        className="absolute inset-0"
      >
        {/* Subtle top-left gradient */}
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-gradient-to-br from-primary/8 via-transparent to-transparent rounded-full blur-[120px]" />
        
        {/* Subtle bottom-right gradient */}
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-tl from-accent/6 via-transparent to-transparent rounded-full blur-[100px]" />
        
        {/* Very subtle center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-[80px] rounded-full" />
      </motion.div>

      {/* Clean grid pattern overlay - very subtle */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Fade to background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
});

// Service card component - mobile: centered layout, desktop: horizontal layout
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
      {/* Mobile: Centered vertical layout */}
      <div className="flex flex-col items-center text-center sm:hidden">
        <div className={`w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform duration-300 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display font-semibold text-base text-foreground mb-2 transition-colors duration-200 group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
        <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{outcome}</span>
        </div>
      </div>
      
      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-start gap-4">
        <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 ${!prefersReducedMotion ? 'group-hover:scale-110' : ''}`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 transition-colors duration-200 group-hover:text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{outcome}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Hero content wrapper with 3D tilt effect
const HeroContent = memo(function HeroContent({ 
  children, 
  reduceMotion 
}: { 
  children: React.ReactNode;
  reduceMotion: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion || reduceMotion;
  const { scrollY } = useScroll();
  
  // 3D tilt transforms based on scroll
  const rotateX = useTransform(scrollY, [0, 400], [0, shouldReduceMotion ? 0 : -8]);
  const perspective = useTransform(scrollY, [0, 400], [1000, shouldReduceMotion ? 1000 : 800]);
  const translateZ = useTransform(scrollY, [0, 400], [0, shouldReduceMotion ? 0 : -50]);
  const scale = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0.95]);
  const opacity = useTransform(scrollY, [0, 400], [1, shouldReduceMotion ? 1 : 0.7]);

  return (
    <motion.div 
      id="main-content" 
      className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8"
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          translateZ,
          scale,
          opacity,
          transformOrigin: "center top",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  const performanceMode = usePerformanceMode();
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen overflow-x-hidden pb-16 lg:pb-0">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <EccentricNavbar />
      <SectionIndicator />
      <MobileProgressBar />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground reduceMotion={performanceMode.reduceMotion} />

        <HeroContent reduceMotion={performanceMode.reduceMotion}>
          <div className="w-full max-w-4xl mx-auto">
            {/* Hello, NÈKO. - brand signature with NÈKO truly centered on viewport */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
              className="mb-4 sm:mb-6"
            >
              {/* Mobile: Stack layout - Hello above, NÈKO centered */}
              <div className="sm:hidden flex flex-col items-center gap-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-primary-foreground/60 font-normal text-xs tracking-[0.3em] uppercase"
                  aria-hidden="true"
                >
                  Hello,
                </motion.span>
                <h1 className="font-logo font-bold tracking-tighter text-primary-foreground text-[clamp(3rem,14vw,4.5rem)] leading-[0.9]">
                  <NekoLogo />
                  <span className="neko-dot">.</span>
                </h1>
              </div>
              
              {/* Desktop: Position NÈKO at true center, Hello floats left of it */}
              <div className="hidden sm:flex items-center justify-center w-full">
                <div className="relative inline-flex items-center">
                  {/* Hello positioned to the left of NÈKO */}
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute right-full mr-3 md:mr-4 text-primary-foreground/60 font-normal text-sm md:text-base lg:text-lg tracking-[0.25em] uppercase whitespace-nowrap"
                    aria-hidden="true"
                  >
                    Hello,
                  </motion.span>
                  
                  {/* NÈKO - this is the centered element */}
                  <h1 className="font-logo font-bold tracking-tighter text-primary-foreground text-[clamp(4rem,9vw,6.5rem)] leading-[0.9] whitespace-nowrap">
                    <NekoLogo />
                    <span className="neko-dot">.</span>
                  </h1>
                </div>
              </div>
            </motion.div>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.5 }} className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0 font-medium">
              Build business credit. Establish your professional identity. Start with confidence.
            </motion.p>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.6 }} className="text-sm sm:text-base text-primary-foreground/50 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
              Structured guidance for LLC formation, credit building, and personal branding — without the guesswork.
            </motion.p>

            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.7 }} className="flex flex-col items-center gap-4 px-4 sm:px-0">
              <a 
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Button variant="hero-outline" size="lg" className="group min-h-[48px]">
                  <span className="flex items-center gap-2">
                    Explore Solutions
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </a>
              <p className="text-xs sm:text-sm text-primary-foreground/40">
                Business formation · Credit building · Personal branding
              </p>
            </motion.div>
          </div>
        </HeroContent>

        {/* Enhanced scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          className="hidden sm:flex flex-col items-center gap-2 absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.span 
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary-foreground/40"
          >
            Scroll
          </motion.span>
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-2"
          >
            {/* Animated dot */}
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
                opacity: [1, 0.6, 1],
                scale: [1, 0.8, 1]
              }} 
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }} 
              className="w-1.5 h-1.5 bg-primary-foreground/50 rounded-full"
            />
            {/* Subtle glow effect */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full bg-primary-foreground/5 blur-sm"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Sound Familiar Section */}
      <section id="starting-points" className="py-12 sm:py-16 lg:py-24 bg-muted/30 relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                Sound Familiar?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                You're ready. You just need the roadmap.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Building a fundable business with strong credit doesn't have to be overwhelming. When you know the steps, everything becomes clearer.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {startingPoints.map((point, index) => (
              <motion.div 
                key={index} 
                variants={staggerItem}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border min-h-[72px]"
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

      {/* How We Help Section */}
      <section id="how-we-help" className="py-12 sm:py-16 lg:py-28 bg-background relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                How We Help
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                From formation to fundability.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NÈKO guides you through the foundational steps of building a legitimate, credit-ready business. We focus on what lenders and underwriters actually look for: proper entity structure, tradeline history, payment patterns, and documentation readiness.
                </p>
                <p>
                  We work across two complementary tracks: <strong className="text-foreground">business infrastructure</strong> (formation, banking, credit building) and <strong className="text-foreground">professional presence</strong> (your Digital CV and online identity). Use one or both.
                </p>
              </div>
              
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">What you'll build</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A properly structured business entity. Tradelines that report to business bureaus. A Paydex score. Documentation ready for underwriting review. A professional online presence.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="lg:pl-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-base sm:text-lg mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  Who We Help
                </h3>
                <div className="space-y-3">
                  {audiences.map((audience, index) => (
                    <div key={audience.label} className="flex items-start gap-3 group">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="pt-0.5 min-w-0">
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

      {/* Solutions Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                Solutions
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Everything you need to build fundability.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From entity formation to tradeline building to professional branding. Each track can stand alone, or work together to amplify your credibility.
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
                  <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">Business Credit & Formation</h3>
                  <p className="text-sm text-muted-foreground">Entity structure, tradelines, and fundability readiness</p>
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

      {/* How It Works / Paths Section */}
      <section id="paths" className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection direction="none">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-3">
                How It Works
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
                Choose your path. Or combine them.
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/60 max-w-xl mx-auto">
                Each track is designed to work independently or together for maximum impact.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Business Only Path */}
                <div className="relative">
                  <div className="p-5 sm:p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 text-primary-foreground flex items-center justify-center mb-4">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-primary-foreground mb-2">
                      Business Only
                    </h3>
                    <p className="text-sm text-primary-foreground/60 mb-4">
                      Focus on entity formation and credit building.
                    </p>
                    <ul className="space-y-2">
                      {["LLC Formation Guide", "EIN Registration", "Business Banking Setup", "Net-30 Vendor Accounts", "Tradeline Tracking"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground/50 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1">Businesses that need credit infrastructure</p>
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
                      Complete business infrastructure plus personal branding.
                    </p>
                    <ul className="space-y-2">
                      {["Everything in Business", "Digital CV Builder", "Professional Landing Page", "SEO Optimization", "Unified Brand Story"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span>{item}</span>
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
                      Establish your professional digital identity.
                    </p>
                    <ul className="space-y-2">
                      {["Digital CV Builder", "Public Profile Page", "Link Aggregation", "Portfolio Showcase", "SEO Optimization"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground/50 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                      <p className="text-xs text-primary-foreground/40 uppercase tracking-wide">Best for</p>
                      <p className="text-sm text-primary-foreground/70 mt-1">Freelancers, consultants, and professionals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection visual */}
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

          <AnimatedSection delay={0.2} className="text-center mt-10">
            <Link to="/services" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
              See detailed breakdown <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <HomePricing />

      {/* The Experience Section */}
      <section id="experience" className="py-12 sm:py-16 lg:py-28 bg-background relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="The Experience"
              title="What working with NÈKO looks like."
              description="Structured guidance, progress tracking, and clarity at every step. No guesswork."
              centered
              className="mb-10 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto" staggerDelay={0.1}>
            {[
              { icon: Shield, title: "Guided Formation", description: "Step-by-step walkthroughs for LLC setup, EIN registration, and business banking." },
              { icon: Wallet, title: "Credit Building Roadmap", description: "Clear path through net-30 vendors, tradelines, and business credit bureaus." },
              { icon: User, title: "Digital CV Builder", description: "Create a professional online presence that tells your story." },
              { icon: TrendingUp, title: "Progress Tracking", description: "Dashboard visibility into your journey from formation to fundability." },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                variants={staggerCardItem}
                className="group p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center min-h-[180px] flex flex-col"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4 mx-auto transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Product Demos Section */}
      <section id="demos" className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-[5%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <SectionHeading
              label="See It In Action"
              title="Explore what you'll get."
              description="Interactive previews of your dashboard experience. Click any to see the full demo."
              centered
              className="mb-10 sm:mb-14"
            />
          </AnimatedSection>

          <MotionConfig reducedMotion={performanceMode.reduceMotion ? "always" : "user"}>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <AnimatedSection direction="left" delay={0}>
                <LazyMount
                  className="min-h-[420px] lg:min-h-[460px]"
                  fallback={
                    <PreviewPlaceholder
                      title="Building fundability preview"
                      description="Your business foundation and underwriting review journey, loading now."
                    />
                  }
                >
                  <PreviewErrorBoundary
                    fallback={
                      <PreviewPlaceholder
                        title="Building fundability preview"
                        description="Your business foundation and underwriting review journey, loading now."
                      />
                    }
                  >
                    <Suspense
                      fallback={
                        <PreviewPlaceholder
                          title="Building fundability preview"
                          description="Your business foundation and underwriting review journey, loading now."
                        />
                      }
                    >
                      <DashboardPreview />
                    </Suspense>
                  </PreviewErrorBoundary>
                </LazyMount>
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
                <LazyMount
                  className="min-h-[420px] lg:min-h-[460px]"
                  fallback={
                    <PreviewPlaceholder
                      title="Tradelines preview"
                      description="Net-30 tradelines and Paydex score insights are on the way."
                    />
                  }
                >
                  <PreviewErrorBoundary
                    fallback={
                      <PreviewPlaceholder
                        title="Tradelines preview"
                        description="Net-30 tradelines and Paydex score insights are on the way."
                      />
                    }
                  >
                    <Suspense
                      fallback={
                        <PreviewPlaceholder
                          title="Tradelines preview"
                          description="Net-30 tradelines and Paydex score insights are on the way."
                        />
                      }
                    >
                      <BusinessCreditPreview />
                    </Suspense>
                  </PreviewErrorBoundary>
                </LazyMount>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-5"
                >
                  <p className="font-display font-bold text-foreground">Credit Builder</p>
                  <p className="text-sm text-muted-foreground mt-1">Build tradelines with vendors that report to business bureaus.</p>
                </motion.div>
              </AnimatedSection>
              
              <AnimatedSection direction="right" delay={0.2}>
                <LazyMount
                  className="min-h-[420px] lg:min-h-[460px]"
                  fallback={
                    <PreviewPlaceholder
                      title="Digital CV preview"
                      description="Your professional online presence with SEO optimization is loading."
                    />
                  }
                >
                  <PreviewErrorBoundary
                    fallback={
                      <PreviewPlaceholder
                        title="Digital CV preview"
                        description="Your professional online presence with SEO optimization is loading."
                      />
                    }
                  >
                    <Suspense
                      fallback={
                        <PreviewPlaceholder
                          title="Digital CV preview"
                          description="Your professional online presence with SEO optimization is loading."
                        />
                      }
                    >
                      <PersonalBrandPreview />
                    </Suspense>
                  </PreviewErrorBoundary>
                </LazyMount>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-5"
                >
                  <p className="font-display font-bold text-foreground">Personal Brand</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your Digital CV and professional landing page.</p>
                </motion.div>
              </AnimatedSection>
            </div>
          </MotionConfig>

          <AnimatedSection delay={0.3} className="text-center mt-12 sm:mt-14">
            <Link to="/get-started">
              <Button variant="default" size="lg" className="group shadow-lg shadow-primary/20 min-h-[48px]" aria-label="Start building your business today">
                Start Building Today
                <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-28 bg-background relative" aria-labelledby="faq-heading">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="FAQ"
              title="Common questions, clear answers."
              description="Everything you need to know about building business credit and working with NÈKO."
              centered
              className="mb-10 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-5 sm:px-6 data-[state=open]:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium py-4 sm:py-5 hover:no-underline hover:text-primary min-h-[56px]">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="text-center mt-10">
            <p className="text-sm text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Link to="/contact">
              <Button variant="outline" size="default" className="min-h-[44px]">
                Contact Us
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
              Ready to Start?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-3 sm:mb-4">
              Build your business credit today.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 mb-8 sm:mb-10 max-w-md mx-auto px-2">
              Whether you're forming an LLC, building tradelines, or establishing your professional identity — we're here to guide you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group min-h-[48px]" aria-label="Get started building your business">
                  Get Started
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto min-h-[48px]" aria-label="View pricing plans">View Pricing</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
