import { memo, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  User, 
  Target,
  XCircle
} from "lucide-react";

const journeySteps = [
  { step: "01", title: "Start your business", description: "Form your LLC, get your EIN, establish legitimacy" },
  { step: "02", title: "Build business credit", description: "Progress through credit tiers strategically" },
  { step: "03", title: "Create your brand", description: "Build your Digital CV and web presence" },
  { step: "04", title: "Grow with intention", description: "Scale when you're ready, not before" },
];

const features = [
  { icon: Building2, title: "Business Formation", description: "Guided steps to form your LLC and establish legitimacy from day one." },
  { icon: CreditCard, title: "Business Credit", description: "A structured path through vendor accounts, store credit, and revolving lines." },
  { icon: User, title: "Personal Brand", description: "Build your Digital CV — a professional page that tells your story." },
];

const notList = ["A credit repair service", "Legal or financial advice", "Get-rich-quick schemes", "A generic website builder"];

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
    <span className="inline-flex items-baseline">
      {nekoLetters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: letter.delay + 0.3,
            ease: easeOutExpo,
          }}
          className="inline-block neko-letter"
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <motion.span
            className="inline-block relative"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 40px hsl(168 65% 50% / 0.4)"
            }}
            transition={{ duration: 0.2 }}
          >
            {letter.char}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
});

const HeroBackground = memo(function HeroBackground({ scrollY }: { scrollY: ReturnType<typeof useTransform> }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      {/* Constellation particle effect */}
      <div className="absolute inset-0 z-0">
        <ConstellationBackground />
      </div>
      
      {/* Primary floating orb */}
      <motion.div 
        style={{ y: scrollY }}
        className="absolute top-1/4 left-[10%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50 gpu-accelerated motion-safe:animate-float" 
      />
      {/* Secondary floating orb */}
      <motion.div 
        style={{ y: useTransform(scrollY, v => (v as number) * 0.6) }}
        className="absolute bottom-1/4 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-40 sm:opacity-50 gpu-accelerated motion-safe:animate-float-delayed" 
      />
      {/* Center ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: easeOutExpo }}
        className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" 
      />
      {/* Inner ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.7, ease: easeOutExpo }}
        className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary-foreground/5 rounded-full" 
      />
      {/* Subtle glow behind NEKO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[300px] sm:w-[500px] h-[150px] sm:h-[200px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl rounded-full"
      />
    </div>
  );
});

export default function Index() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  
  // Hero parallax
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroBackgroundY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  
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
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground scrollY={heroBackgroundY} />
        <CursorGlow />

        <motion.div 
          style={{ opacity: prefersReducedMotion ? 1 : heroOpacity }}
          className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10 text-center"
        >
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
              className="font-display font-bold tracking-tight text-primary-foreground mb-4 sm:mb-6 text-[clamp(3rem,11vw,8rem)] leading-[0.9] neko-title"
            >
              <NekoLogo />
              <span className="neko-dot">.</span>
            </motion.h1>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.5 }} className="text-base sm:text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0">
              A guided operating system for building legitimate businesses and personal brands.
            </motion.p>

            <motion.p {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.6 }} className="text-sm sm:text-base text-primary-foreground/50 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
              From formation to credit to brand — with structure, education, and clarity at every step.
            </motion.p>

            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  <span className="flex items-center gap-2">
                    Say Hello
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">Learn More</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

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

      {/* What is NEKO Section */}
      <section className="py-12 sm:py-16 lg:py-28 bg-background relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <SectionHeading label="What is NÈKO?" title="Structure for the space between idea and reality." description="For founders, creators, and side-hustlers navigating the gap between wanting to build something and actually running a legitimate business." />
              <p className="mt-4 sm:mt-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
                That gap is where most people get stuck. Too many options. Too much noise. No clear path forward.
              </p>
              <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                NÈKO provides the roadmap.
              </p>
              <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                  <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  NÈKO is not:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {notList.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="lg:pl-6">
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-base sm:text-lg mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  The Path
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {journeySteps.map((step, index) => (
                    <div key={step.step} className="flex items-start gap-2.5 sm:gap-3 group">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 transition-colors duration-300 ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        {step.step}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-semibold text-foreground text-xs sm:text-sm transition-colors duration-200 group-hover:text-primary">{step.title}</h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{step.description}</p>
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
      <section className="py-12 sm:py-16 lg:py-28 bg-muted/30 relative">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <SectionHeading label="What We Build" title="The tools to start, build, and grow." description="Business formation. Business credit. Personal brand. Each with structure and guidance." centered className="mb-8 sm:mb-10 md:mb-12" />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
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
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-3 sm:mb-4">
              Hello, NÈKO.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 mb-8 sm:mb-10 max-w-md mx-auto px-2">
              Ready to start? All you have to do is say hello.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                  Say Hello
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">View Pricing</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
