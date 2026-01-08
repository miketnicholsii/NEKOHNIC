import { memo, useMemo, useRef } from "react";
import { motion, useReducedMotion, useInView, useScroll, useTransform } from "framer-motion";
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
const smoothSpring = { type: "spring", stiffness: 100, damping: 20 };

// Parallax hook for scroll-based transforms
function useParallax(offset: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset * -100, offset * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  return { ref, y, opacity };
}

const HeroBackground = memo(function HeroBackground({ 
  scrollY, 
  scrollYMedium, 
  scrollYSlow 
}: { 
  scrollY: ReturnType<typeof useTransform>; 
  scrollYMedium: ReturnType<typeof useTransform>;
  scrollYSlow: ReturnType<typeof useTransform>;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, ease: easeOutExpo }}
        style={{ y: scrollY }}
        className="absolute top-1/4 left-[10%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl gpu-accelerated motion-safe:animate-float" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: easeOutExpo }}
        style={{ y: scrollYMedium }}
        className="absolute bottom-1/3 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl gpu-accelerated motion-safe:animate-float-delayed" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: easeOutExpo }}
        style={{ y: scrollYSlow }}
        className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" 
      />
    </div>
  );
});

// Animated list item component for staggered reveals
const AnimatedListItem = memo(function AnimatedListItem({ 
  children, 
  index,
  className = ""
}: { 
  children: React.ReactNode; 
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: easeOutExpo 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Animated check list item
const AnimatedCheckItem = memo(function AnimatedCheckItem({ 
  item, 
  index 
}: { 
  item: string; 
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  
  return (
    <motion.li 
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: easeOutExpo }}
      className="flex items-center gap-3 text-foreground"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.06 + 0.1, type: "spring", stiffness: 300 }}
      >
        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
      </motion.div>
      <span className="text-sm">{item}</span>
    </motion.li>
  );
});

// Section divider with animated line
const SectionDivider = memo(function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div ref={ref} className="py-8 flex justify-center">
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: easeOutExpo }}
        className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </div>
  );
});

// CTA Section with parallax
const CTASection = memo(function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  
  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-dark pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* Animated background elements with parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          style={{ scale: glowScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        />
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <AnimatedSection direction="none">
          <motion.h2 
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4"
          >
            Hello, NÈKO.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto"
          >
            Ready to start? All you have to do is say hello.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Say Hello
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
});

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  
  // Hero parallax scroll
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroBackgroundY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroBackgroundYMedium = useTransform(heroScrollProgress, [0, 1], [0, 90]);
  const heroBackgroundYSlow = useTransform(heroScrollProgress, [0, 1], [0, 45]);
  const heroContentY = useTransform(heroScrollProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 20, filter: "blur(8px)" }, 
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.6, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: easeOutExpo }
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />
      <SectionNav />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16">
        <motion.div 
          style={{ y: heroBackgroundY }}
          className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" 
          aria-hidden="true" 
        />
        <HeroBackground 
          scrollY={heroBackgroundY} 
          scrollYMedium={heroBackgroundYMedium} 
          scrollYSlow={heroBackgroundYSlow} 
        />

        <motion.div 
          style={{ y: heroContentY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p 
              variants={heroItemVariants}
              className="text-sm font-medium tracking-widest uppercase text-primary-foreground/50 mb-4"
            >
              Services
            </motion.p>
            <motion.h1 
              variants={heroItemVariants}
              className="font-display font-bold tracking-tighter text-primary-foreground mb-6 text-[clamp(2rem,6vw,4rem)] leading-[1.1]"
            >
              The path forward.
            </motion.h1>
            <motion.p 
              variants={heroItemVariants}
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
            >
              From formation to credit to brand. Each step structured, trackable, and designed for sustainable progress.
            </motion.p>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 mx-auto flex items-start justify-center pt-2"
              >
                <motion.div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview - What You Get */}
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

      <SectionDivider />

      {/* Business Starter Flow */}
      <section id="formation" className="py-16 sm:py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
              >
                <Building2 className="h-3.5 w-3.5" />
                Start
              </motion.div>
              <SectionHeading
                title="Business Formation"
                description="The foundation. A guided path to properly form your business and establish legitimacy from day one."
              />

              <div className="mt-8 space-y-3">
                {legitimacySteps.map((step, index) => (
                  <AnimatedListItem key={step.title} index={index}>
                    <motion.div 
                      whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border cursor-default"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"
                      >
                        <step.icon className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  </AnimatedListItem>
                ))}
              </div>

              <AnimatedSection delay={0.4} className="mt-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-xl bg-secondary/10 border border-secondary/30"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-foreground mb-2">Your EIN is free</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Directly from the IRS. We never charge for EIN filing.
                      </p>
                      <motion.a 
                        href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 3 }}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Apply at IRS.gov
                        <ExternalLink className="h-3 w-3" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="lg:sticky lg:top-28">
              <BusinessStarterPreview />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Business Credit Builder */}
      <section id="credit" className="py-16 sm:py-20 lg:py-28 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 justify-center mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <CreditCard className="h-3.5 w-3.5" />
                Build
              </div>
            </motion.div>
            <SectionHeading
              title="Business Credit"
              description="Credit is built in stages. Each tier prepares you for the next — with consistency and early payments as the foundation."
              centered
              className="mb-10"
            />
          </AnimatedSection>

          {/* Preview First */}
          <AnimatedSection delay={0.1} direction="up" className="mb-12">
            <div className="max-w-4xl mx-auto">
              <BusinessCreditPreview />
            </div>
          </AnimatedSection>

          {/* Credit Tiers */}
          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.08}>
            {creditTiers.map((tier) => (
              <motion.div 
                key={tier.tier} 
                variants={staggerItem}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <TierCard
                  tier={tier.tier}
                  title={tier.title}
                  description={tier.description}
                  features={tier.features}
                  status={tier.status}
                />
              </motion.div>
            ))}
          </AnimatedStagger>

          <AnimatedSection delay={0.5} direction="up" className="mt-10">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                </motion.div>
                <div>
                  <p className="font-medium text-foreground mb-1">The principle is simple</p>
                  <p className="text-sm text-muted-foreground">
                    Pay early. Pay in full. Be consistent. There are no shortcuts.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <SectionDivider />

      {/* Personal Brand & Scale */}
      <section id="brand" className="py-16 sm:py-20 lg:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Personal Brand */}
            <AnimatedSection direction="left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
              >
                <User className="h-3.5 w-3.5" />
                Brand
              </motion.div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-3 text-foreground">
                Personal Brand
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your Digital CV. A professional page that tells your story, showcases your work, and positions you as credible.
              </p>
              
              <ul className="space-y-2.5 mb-6">
                {[
                  "Professional personal brand page",
                  "Skills and goals showcase",
                  "Shareable, modern design",
                  "Built for credibility",
                ].map((item, index) => (
                  <AnimatedCheckItem key={item} item={item} index={index} />
                ))}
              </ul>

              <AnimatedSection delay={0.3}>
                <PersonalBrandPreview />
              </AnimatedSection>
            </AnimatedSection>

            {/* Scale */}
            <AnimatedSection direction="right" delay={0.15}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Scale
              </motion.div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-3 text-foreground">
                Growth Tools
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Scaling is optional. These resources exist when you're ready — not before.
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  "Advanced progress analytics",
                  "Growth readiness diagnostics",
                  "Social strategy guidance",
                  "Brand audits and upgrades",
                ].map((item, index) => (
                  <AnimatedCheckItem key={item} item={item} index={index} />
                ))}
              </ul>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -2, boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.15)" }}
                className="p-6 lg:p-8 rounded-2xl bg-card border border-border transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  >
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Scale Plan</h3>
                    <p className="text-sm text-muted-foreground">For growth-ready businesses</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced analytics, growth diagnostics, white-labeled brand pages, and team collaboration tools.
                </p>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full group">
                    View Plans
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
