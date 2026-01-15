import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { Mail, ArrowRight } from "lucide-react";

// Floating orb component for subtle background animation
function FloatingOrbs() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        style={{ top: "-5%", right: "-10%" }}
        animate={{
          x: [0, 40, 0],
          y: [0, 25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-secondary/5 blur-3xl"
        style={{ bottom: "15%", left: "-5%" }}
        animate={{
          x: [0, -25, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
}

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

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <FloatingOrbs />
      <EccentricNavbar />

      {/* Light hero section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Invite Only Badge - Dark Orange */}
            <motion.div 
              {...fadeIn}
              className="flex justify-center mb-10 sm:mb-12"
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-orange-600/30 bg-orange-600/10">
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange-700 dark:text-orange-500">
                  Invite Only
                </span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tightest text-foreground mb-8"
            >
              Good things are built
              <br />
              <span className="text-muted-foreground">with care.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12 sm:mb-14"
            >
              Neko partners with founders who are patiently shaping something real. 
              If that sounds like you, come say hello.
            </motion.p>

            {/* Email CTA - Teal/Primary color like example */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.4 }}
              className="flex justify-center"
            >
              <a
                href="mailto:neko@helloneko.co?subject=Hello%20from%20a%20founder"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg shadow-primary/25"
              >
                <Mail className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                neko@helloneko.co
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: easeOut }}
              className="mt-10 text-sm text-muted-foreground"
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
