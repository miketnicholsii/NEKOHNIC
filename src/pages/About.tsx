import { motion } from "framer-motion";
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
    title: "Intentional Growth",
    description: "We design for the long game. Every feature exists to support sustainable progress, not temporary wins that cost you later.",
  },
  {
    icon: Heart,
    title: "Founder-First",
    description: "Built for people starting from zero. We remember that feeling, and we build accordingly.",
  },
  {
    icon: Lightbulb,
    title: "Education Over Hype",
    description: "No shortcuts, no promises. Just structure, clarity, and the knowledge to make informed decisions.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description: "For freelancers, creators, and entrepreneurs building something real. The right way.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen">
      <EccentricNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center pt-20">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-primary-foreground mb-6"
            >
              Hello, NÈKO.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto leading-relaxed"
            >
              This is a beginning. The moment where intent becomes direction, and the work becomes possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <SectionHeading
                label="Our Story"
                title="NÈKO exists in the space between signal and noise."
                className="mb-10"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  "Hello, NÈKO" is both a greeting and a starting point.
                </p>
                <p>
                  We work with founders, creators, and people building something real — those navigating the gap between having an idea and running a legitimate business.
                </p>
                <p>
                  That gap is where most people get stuck. Starting a business feels overwhelming. There's too much noise, too many options, and no clear path from intent to legitimacy.
                </p>
                <p>
                  NÈKO is a guided operating system. Not a tool. Not a shortcut. A structured path through the complexity — with education, progress tracking, and clarity at every step.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Our Values"
              title="What guides us."
              centered
              className="mb-16"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={staggerItem}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <SectionHeading
                label="Our Mission"
                title="Make starting a business clear, accessible, and legitimate."
                light
                centered
                className="mb-8"
              />
              
              <p className="text-lg text-primary-foreground/70 mb-12 leading-relaxed">
                We provide the roadmap. You build something meaningful.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Hello, NÈKO.
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                The moment where intent becomes action.
              </p>

              <Link to="/contact">
                <Button variant="hero" size="xl" className="group">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
