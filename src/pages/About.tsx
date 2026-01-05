import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { ArrowRight, Heart, Target, Lightbulb, Users, Quote } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Intentional Growth",
    description: "We build for sustainability and legitimacy, not shortcuts. Every feature is designed to support long-term success, not quick wins that compromise your future.",
  },
  {
    icon: Heart,
    title: "Founder-First",
    description: "Every guide, every resource, every feature is built with first-time founders in mind. We remember what it feels like to start from zero.",
  },
  {
    icon: Lightbulb,
    title: "Education Over Hype",
    description: "We don't sell dreams. We provide structure, education, and clear paths forward. Real success comes from understanding, not blind action.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "NÈKO is built for the creator economy — freelancers, side-hustlers, and entrepreneurs who want to build something meaningful the right way.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center pt-20">
          <div className="max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-semibold tracking-wide uppercase text-primary-foreground/60 mb-6"
            >
              About NÈKO
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-primary-foreground mb-6"
            >
              Hello.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/70"
            >
              Welcome, we're glad you're here.
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
                className="mb-8"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="prose prose-lg text-muted-foreground space-y-6">
                <p>
                  "Hello, NÈKO" is both a greeting and a beginning. It's the moment before the work starts — where context is set and intent becomes clear.
                </p>
                <p>
                  We work alongside individuals navigating growth, change, and complexity. Our focus is helping shape decisions at the intersection of business, technology, and long-term strategy.
                </p>
                <p>
                  NÈKO began with a simple question: what if starting a business didn't have to be overwhelming? What if there was a clear path from "I want to do something" to "I'm running a legitimate, credit-worthy business"?
                </p>
                <p>
                  That question became a platform — a guided operating system for building businesses and personal brands from the ground up, with education, structure, and progress tracking at its core.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 relative">
                <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />
                <div className="pl-8">
                  <p className="text-xl font-display font-semibold text-foreground mb-3">
                    "Hello, NÈKO" is a greeting and a beginning.
                  </p>
                  <p className="text-muted-foreground">
                    It's the moment where intent becomes clear and the work begins.
                  </p>
                </div>
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
              title="What we believe in."
              description="These principles guide everything we build and every decision we make."
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
                title="Empowering the next generation of founders."
                light
                centered
                className="mb-8"
              />
              
              <p className="text-lg text-primary-foreground/70 mb-10 leading-relaxed">
                NÈKO's mission is to make starting a business accessible, understandable, and achievable for everyone. We provide the roadmap so you can focus on what matters — building something meaningful.
              </p>

              <Link to="/signup">
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
