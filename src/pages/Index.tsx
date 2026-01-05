import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Geometric background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-foreground/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-foreground/5 rounded-full" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium tracking-wide">
                <Sparkles className="h-4 w-4" />
                Your Operating System for Success
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tightest text-primary-foreground mb-6"
            >
              Build Your Business.
              <br />
              <span className="text-primary-foreground/80">Build Your Brand.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10"
            >
              NEKO is your guided platform for building legitimate businesses and personal brands — from zero to scale — with progress tracking every step of the way.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/get-started">
                <Button variant="hero" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="hero-outline" size="xl">
                  Explore Services
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12"
            >
              {["Guidance + Execution", "Education + Structure", "Progress + Momentum"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* What is NEKO Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection direction="left">
              <SectionHeading
                label="What is NEKO?"
                title="Your guided path from idea to reality."
                description="NEKO is a structured operating system that helps first-time founders, creators, freelancers, and side-hustlers build legitimate businesses and personal brands — with clear progress tracking at every stage."
              />

              <div className="mt-8 space-y-4">
                <p className="text-muted-foreground">
                  We believe starting a business shouldn't be overwhelming. NEKO provides the roadmap, education, and structure you need to move from "I want to start something" to "I'm running a legitimate business."
                </p>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-4">NEKO is NOT:</p>
                <div className="grid grid-cols-2 gap-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="lg:pl-8">
              <div className="p-8 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your Journey
                </h3>
                <ProgressTracker steps={journeySteps} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Platform Features"
              title="Everything you need to start, build, and grow."
              description="From business formation to personal branding, NEKO provides the tools and guidance for every stage of your journey."
              centered
              className="mb-16"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <SectionHeading
              label="Ready to Start?"
              title="Begin your journey today."
              description="Join thousands of founders who are building their businesses the right way — with NEKO as their guide."
              centered
              light
              className="mb-10"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <Button variant="hero" size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">
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
