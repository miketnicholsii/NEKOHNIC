import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ProgressTracker } from "@/components/ProgressTracker";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  User, 
  Globe, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Target,
  Shield
} from "lucide-react";

const journeySteps = [
  {
    id: "start",
    title: "Start Your Business",
    description: "Form your LLC, get your EIN, and establish legitimacy",
    status: "completed" as const,
  },
  {
    id: "build",
    title: "Build Business Credit",
    description: "Progress through credit tiers with strategic vendor accounts",
    status: "current" as const,
  },
  {
    id: "brand",
    title: "Create Your Brand",
    description: "Build your personal brand and digital presence",
    status: "upcoming" as const,
  },
  {
    id: "scale",
    title: "Scale Responsibly",
    description: "Grow with intention when you're ready",
    status: "locked" as const,
  },
];

const features = [
  {
    icon: Building2,
    title: "Business Formation",
    description: "Step-by-step guidance to properly form your LLC and establish your business the right way.",
  },
  {
    icon: CreditCard,
    title: "Business Credit Roadmap",
    description: "Clear, tiered approach to building business credit through legitimate means.",
  },
  {
    icon: User,
    title: "Personal Brand Builder",
    description: "Create a professional digital presence that tells your story and showcases your work.",
  },
  {
    icon: Globe,
    title: "Web Presence Guide",
    description: "Templates and structure for landing pages, about sections, and service offerings.",
  },
  {
    icon: Shield,
    title: "Legitimacy First",
    description: "Everything we teach prioritizes proper business practices and long-term success.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visual milestones and checklists to track your journey and maintain momentum.",
  },
];

const trustPoints = [
  "Not a credit repair service",
  "Not get-rich-quick schemes",
  "Not legal or financial advice",
  "Not a generic website builder",
];

const trustIndicators = ["Guidance + Execution", "Education + Structure", "Progress + Momentum"];

// Easing curve as tuple for Framer Motion type compatibility
const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  
  // Animation config - simplified if reduced motion preferred
  const fadeIn = prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOut }
      };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16 sm:pt-0 sm:pb-0">
        {/* Geometric background elements - decorative only */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none" 
          aria-hidden="true"
        >
          {/* Floating blobs - reduced on mobile for performance */}
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-primary-foreground/5 rounded-full blur-2xl sm:blur-3xl motion-safe:animate-float opacity-60 sm:opacity-100" />
          <div 
            className="absolute bottom-1/4 right-1/4 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 bg-primary-foreground/5 rounded-full blur-2xl sm:blur-3xl motion-safe:animate-float opacity-60 sm:opacity-100" 
            style={{ animationDelay: "2s" }} 
          />
          {/* Concentric circles - hidden on very small screens */}
          <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] lg:w-[600px] h-[500px] lg:h-[600px] border border-primary-foreground/10 rounded-full" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[800px] h-[700px] lg:h-[800px] border border-primary-foreground/5 rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Label */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0 }}
              className="mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm font-medium tracking-wide">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Your Operating System for Success
              </span>
            </motion.div>

            {/* Main Headline - responsive clamp sizing */}
            <motion.h1 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="font-display font-bold tracking-tightest text-primary-foreground mb-4 sm:mb-6 text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] text-balance"
            >
              Build Your Business.
              <br />
              <span className="text-primary-foreground/80">Build Your Brand.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
            >
              NEKO is your guided platform for building legitimate businesses and personal brands — from zero to scale — with progress tracking every step of the way.
            </motion.p>

            {/* CTAs - full width on mobile */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators - better mobile wrap */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mt-8 sm:mt-12 px-4 sm:px-0"
            >
              {trustIndicators.map((item) => (
                <div key={item} className="flex items-center gap-1.5 sm:gap-2 text-primary-foreground/60 text-xs sm:text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground flex-shrink-0" />
                  <span className="whitespace-nowrap">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - hidden on very small screens */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-pulse-soft"
          aria-hidden="true"
        >
          <div className="w-5 sm:w-6 h-8 sm:h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5 sm:p-2">
            <div className="w-1 h-1.5 sm:h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* What is NEKO Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <SectionHeading
                label="What is NEKO?"
                title="Your guided path from idea to reality."
                description="NEKO is a structured operating system that helps first-time founders, creators, freelancers, and side-hustlers build legitimate businesses and personal brands — with clear progress tracking at every stage."
              />

              <div className="mt-6 sm:mt-8 space-y-4">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  We believe starting a business shouldn't be overwhelming. NEKO provides the roadmap, education, and structure you need to move from "I want to start something" to "I'm running a legitimate business."
                </p>
              </div>

              <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-muted/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-3 sm:mb-4">NEKO is NOT:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" aria-hidden="true" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15} className="lg:pl-8">
              <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-base sm:text-lg mb-5 sm:mb-6 flex items-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
                  Your Journey
                </h3>
                <ProgressTracker steps={journeySteps} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Platform Features"
              title="Everything you need to start, build, and grow."
              description="From business formation to personal branding, NEKO provides the tools and guidance for every stage of your journey."
              centered
              className="mb-10 sm:mb-12 lg:mb-16"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <SectionHeading
              label="Ready to Start?"
              title="Begin your journey today."
              description="Join thousands of founders who are building their businesses the right way — with NEKO as their guide."
              centered
              light
              className="mb-8 sm:mb-10"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
