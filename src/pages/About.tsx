import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { ArrowRight, Target, Heart, Lightbulb, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Clarity First",
    description: "We cut through the noise so you can focus on building what matters.",
  },
  {
    icon: Heart,
    title: "Built for Beginnings",
    description: "Designed for people starting from zero. We remember that feeling.",
  },
  {
    icon: Lightbulb,
    title: "Education Over Shortcuts",
    description: "Real understanding creates lasting results. No hacks, no gimmicks.",
  },
  {
    icon: Users,
    title: "For Founders & Creators",
    description: "Whether building a business or a personal brand, we meet you where you are.",
  },
];

const principles = [
  { number: "01", text: "Clarity over complexity" },
  { number: "02", text: "Progress over perfection" },
  { number: "03", text: "Structure over chaos" },
  { number: "04", text: "Education over promises" },
];

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      <div className="absolute top-1/4 left-[15%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-50 gpu-accelerated motion-safe:animate-float" />
      <div className="absolute bottom-1/3 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-50 gpu-accelerated motion-safe:animate-float-delayed" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" />
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] border border-primary-foreground/5 rounded-full" />
    </div>
  );
});

export default function About() {
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

      {/* Hero Section - Full height like Index */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16 sm:pt-0 sm:pb-0">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.p 
              {...fadeIn} 
              transition={{ ...fadeIn.transition, delay: 0 }}
              className="text-sm font-medium tracking-widest uppercase text-primary-foreground/50 mb-4"
            >
              About
            </motion.p>
            
            <motion.h1 
              {...fadeIn} 
              transition={{ ...fadeIn.transition, delay: 0.05 }}
              className="font-display font-bold tracking-tighter text-primary-foreground mb-6 text-[clamp(2rem,6.5vw,4.5rem)] leading-[1.1]"
            >
              Hello, NÈKO.
            </motion.h1>
            
            <motion.p 
              {...fadeIn} 
              transition={{ ...fadeIn.transition, delay: 0.1 }}
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              We believe starting a business shouldn't feel overwhelming. Neither should building a professional presence.
            </motion.p>
            
            <motion.p 
              {...fadeIn} 
              transition={{ ...fadeIn.transition, delay: 0.15 }}
              className="text-base text-primary-foreground/50 max-w-xl mx-auto leading-relaxed"
            >
              NÈKO is here to make the path clear.
            </motion.p>
          </div>
        </div>

        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="w-5 h-8 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-1.5">
            <motion.div 
              animate={{ y: [0, 6, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
              className="w-1 h-1.5 bg-primary-foreground/40 rounded-full" 
            />
          </div>
        </div>
      </section>

      {/* Story Section - Two column layout */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <SectionHeading
                label="Our Story"
                title="For the space between idea and reality."
                className="mb-8"
              />
              
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>We started NÈKO because we saw something frustrating: talented people with great ideas getting stuck on the logistics.</p>
                <p>Not because they couldn't do it — but because no one had shown them the path clearly. How do you actually form an LLC? What's the right order for building business credit? How do you create a professional presence without spending months on it?</p>
                <p>We built NÈKO to be the guide we wished we'd had. Calm, clear, and genuinely helpful.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="lg:pt-12">
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  What We Believe
                </h3>
                <div className="space-y-4">
                  {principles.map((item, index) => (
                    <div key={item.number} className="flex items-center gap-3 group">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-300 ${
                        index === 0 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        {item.number}
                      </div>
                      <p className="font-medium text-foreground text-sm transition-colors duration-200 group-hover:text-primary">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What We Are Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-muted/30 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <SectionHeading
                label="What We Are"
                title="Two tracks. One clear path forward."
                description="Whether you're building a business, a personal brand, or both — we provide the structure, guidance, and tools to make it real."
                centered
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Our Values"
              title="What guides us."
              centered
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={staggerItem}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-display font-bold mb-2 text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Mission + CTA Combined */}
      <section className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
              Our Mission
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4 max-w-2xl mx-auto">
              Make the first step feel possible.
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
              Clarity comes from taking action. We help you take that action with confidence.
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

      <Footer />
    </main>
  );
}
