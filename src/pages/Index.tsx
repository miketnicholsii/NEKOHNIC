import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
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
  Shield,
  XCircle,
  Zap
} from "lucide-react";

const journeySteps = [
  {
    step: "01",
    title: "Start your business",
    description: "Form your LLC, get your EIN, establish legitimacy",
  },
  {
    step: "02",
    title: "Build business credit",
    description: "Progress through credit tiers strategically",
  },
  {
    step: "03",
    title: "Create your brand",
    description: "Build your Digital CV and web presence",
  },
  {
    step: "04",
    title: "Grow with intention",
    description: "Scale when you're ready, not before",
  },
];

const features = [
  {
    icon: Building2,
    title: "Business Formation",
    description: "Step-by-step guidance to properly form your LLC and establish your business with a legitimacy checklist.",
  },
  {
    icon: CreditCard,
    title: "Business Credit Roadmap",
    description: "A tiered approach to building business credit through vendor accounts, store credit, and revolving lines.",
  },
  {
    icon: User,
    title: "Personal Brand Builder",
    description: "Create your Digital CV — a professional page that tells your story, showcases your work, and builds credibility.",
  },
];

const notList = [
  "A credit repair service",
  "Legal or financial advice",
  "Get-rich-quick schemes",
  "A generic website builder",
];

const trustIndicators = [
  { icon: Zap, label: "Guided Execution" },
  { icon: Shield, label: "Structured Progress" },
  { icon: TrendingUp, label: "Real Momentum" },
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  
  const fadeIn = prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 20 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: easeOutExpo }
      };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <EccentricNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16 sm:pt-0 sm:pb-0">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/5 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] bg-primary-foreground/5 rounded-full blur-3xl motion-safe:animate-float opacity-40 sm:opacity-60" />
          <div 
            className="absolute bottom-1/4 right-1/5 w-64 sm:w-80 lg:w-[400px] h-64 sm:h-80 lg:h-[400px] bg-primary-foreground/5 rounded-full blur-3xl motion-safe:animate-float-delayed opacity-40 sm:opacity-60" 
          />
          
          {/* Concentric circles */}
          <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] border border-primary-foreground/10 rounded-full" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[900px] h-[700px] lg:h-[900px] border border-primary-foreground/5 rounded-full" />
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-primary-foreground/[0.03] rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0 }}
              className="mb-8 sm:mb-10"
            >
              <span className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/10 text-primary-foreground text-xs sm:text-sm font-medium tracking-wide">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground/80" />
                Your Operating System for Success
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="font-display font-bold tracking-tighter text-primary-foreground mb-6 sm:mb-8 text-[clamp(2.25rem,7vw,5rem)] leading-[1.05]"
            >
              Build Your Business.
              <br />
              <span className="text-primary-foreground/70">Build Your Brand.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2 sm:px-0"
            >
              NÈKO is a guided platform for building legitimate businesses and personal brands — from zero to scale — with progress tracking at every step.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 mt-12 sm:mt-16 px-4 sm:px-0"
            >
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-primary-foreground/50 text-sm">
                  <item.icon className="h-4 w-4 text-primary-foreground/60" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden sm:flex absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 motion-safe:animate-pulse-soft"
          aria-hidden="true"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-primary-foreground/40 rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* What is NEKO Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-background relative">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden="true" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <SectionHeading
                label="What is NÈKO?"
                title="Your guided path from idea to reality."
                description="NÈKO is a structured operating system for first-time founders, creators, freelancers, and side-hustlers. We reduce overwhelm by providing a clear roadmap with progress checkpoints at every stage."
              />

              <div className="mt-8 space-y-4">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Starting a business shouldn't be overwhelming. NÈKO provides the roadmap, education, and structure you need to move from "I want to start something" to "I'm running a legitimate business."
                </p>
              </div>

              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-muted/50 border border-border">
                <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  NÈKO is NOT:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {notList.map((point) => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15} className="lg:pl-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-lg">
                <h3 className="font-display font-bold text-lg sm:text-xl mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  Your Journey
                </h3>
                <div className="space-y-5">
                  {journeySteps.map((step, index) => (
                    <div key={step.step} className="flex items-start gap-4 group">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                        index === 0 
                          ? "bg-primary text-primary-foreground shadow-glow" 
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        {step.step}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{step.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" aria-hidden="true" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <SectionHeading
              label="Platform Features"
              title="Everything you need to start, build, and grow."
              description="From business formation to personal branding, NÈKO provides the tools and guidance for every stage of your journey."
              centered
              className="mb-12 sm:mb-16"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
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

          {/* Additional feature pills */}
          <AnimatedSection delay={0.4} className="mt-14 flex flex-wrap justify-center gap-3">
            {[
              { icon: Globe, label: "Web Presence Guide" },
              { icon: Shield, label: "Legitimacy First" },
              { icon: TrendingUp, label: "Progress Tracking" },
            ].map((item) => (
              <div 
                key={item.label} 
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card border border-border text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-300 cursor-default"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-tertiary relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" aria-hidden="true" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <SectionHeading
              label="Ready to Start?"
              title="Begin your journey today."
              description="Join founders who are building their businesses the right way — with NÈKO as their guide."
              centered
              light
              className="mb-10 sm:mb-12"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
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
