import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { Mail, Sparkles } from "lucide-react";

export default function GetStarted() {
  const prefersReducedMotion = useReducedMotion();

  const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const fadeIn = prefersReducedMotion 
    ? {} 
    : { 
        initial: { opacity: 0, y: 20 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: easeOut }
      };

  const stagger = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOut, delay: 0.2 }
      };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Invite Only Badge */}
            <motion.div 
              {...fadeIn}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 mb-8 sm:mb-10"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium tracking-wide text-foreground">
                Invite Only
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              {...fadeIn}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tightest text-foreground mb-6"
            >
              We're selective about
              <br />
              <span className="text-primary">who we work with.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              {...stagger}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 sm:mb-12 max-w-lg mx-auto"
            >
              Neko is built for serious founders ready to build something real. 
              If that's you, we'd love to hear from you.
            </motion.p>

            {/* Email CTA */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.35 }}
            >
              <a
                href="mailto:neko@helloneko.co?subject=Interested%20in%20joining%20Neko"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-medium text-base sm:text-lg transition-all duration-300 hover:bg-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Mail className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                neko@helloneko.co
              </a>
            </motion.div>

            {/* Subtle note */}
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: easeOut }}
              className="mt-8 text-sm text-muted-foreground/70"
            >
              Tell us about yourself and what you're building.
            </motion.p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
