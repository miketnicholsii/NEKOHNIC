import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { Mail } from "lucide-react";

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
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      {/* Dark hero section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-900 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/50 to-slate-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Invite Only Badge */}
            <motion.div 
              {...fadeIn}
              className="flex justify-center mb-10 sm:mb-12"
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400">
                  Invite Only
                </span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tightest text-white text-center mb-8"
            >
              Good things are built
              <br />
              <span className="text-slate-400">with care.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.25 }}
              className="text-lg sm:text-xl text-slate-400 leading-relaxed text-center max-w-xl mx-auto mb-12 sm:mb-16"
            >
              Neko partners with founders who are patiently shaping something real. 
              If that sounds like you, come say hello.
            </motion.p>

            {/* Email CTA */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.4 }}
              className="flex justify-center"
            >
              <a
                href="mailto:neko@helloneko.co?subject=Hello%20from%20a%20founder"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-medium text-base sm:text-lg transition-all duration-300 hover:bg-amber-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <Mail className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                neko@helloneko.co
              </a>
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: easeOut }}
              className="mt-10 text-sm text-slate-500 text-center"
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
