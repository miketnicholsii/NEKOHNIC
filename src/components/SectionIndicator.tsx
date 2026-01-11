import { memo, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Welcome" },
  { id: "starting-points", label: "Sound Familiar?" },
  { id: "how-we-help", label: "How We Help" },
  { id: "two-tracks", label: "Services" },
  { id: "paths", label: "Choose Your Path" },
  { id: "experience", label: "The Experience" },
  { id: "cta", label: "Get Started" },
];

/**
 * Desktop: Vertical dot indicator on the right side
 */
export const SectionIndicator = memo(function SectionIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;

          // Show indicator after scrolling past 20% of viewport
          setIsVisible(scrollY > viewportHeight * 0.2);

          // Find which section is currently in view
          const sectionElements = sections.map(s => document.getElementById(s.id));
          
          let currentIndex = 0;
          for (let i = 0; i < sectionElements.length; i++) {
            const el = sectionElements[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              // Section is "active" when its top is within the top 40% of the viewport
              if (rect.top <= viewportHeight * 0.4) {
                currentIndex = i;
              }
            }
          }
          
          setActiveSection(currentIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  }, [prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <motion.nav
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-2"
      aria-label="Page sections"
    >
      {sections.map((section, index) => {
        const isActive = index === activeSection;
        const isPast = index < activeSection;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
            aria-label={`Go to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Label - shows on hover */}
            <span
              className={cn(
                "text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-2 group-hover:translate-x-0 group-focus-visible:translate-x-0",
                isActive 
                  ? "text-foreground" 
                  : isPast 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground/60"
              )}
            >
              {section.label}
            </span>

            {/* Indicator dot */}
            <span
              className={cn(
                "relative flex items-center justify-center transition-all duration-300",
                isActive ? "w-3 h-3" : "w-2 h-2"
              )}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary scale-100"
                    : isPast
                      ? "bg-primary/40 scale-100"
                      : "bg-muted-foreground/30 scale-100 group-hover:bg-muted-foreground/50"
                )}
              />
              {isActive && !prefersReducedMotion && (
                <motion.span
                  layoutId="active-indicator"
                  className="absolute inset-0 rounded-full bg-primary/30"
                  initial={false}
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </span>
          </button>
        );
      })}

      {/* Progress line */}
      <div className="absolute right-[5px] top-0 bottom-0 w-px bg-border -z-10">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary origin-top"
          style={{ 
            height: `${((activeSection + 1) / sections.length) * 100}%`,
          }}
          initial={false}
          animate={{ height: `${((activeSection + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.nav>
  );
});

/**
 * Mobile: Horizontal progress bar at the bottom
 */
export const MobileProgressBar = memo(function MobileProgressBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  
  // Smooth spring animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;

          // Show after scrolling past hero
          setIsVisible(scrollY > viewportHeight * 0.5);

          // Track active section for label
          const sectionElements = sections.map(s => document.getElementById(s.id));
          let currentIndex = 0;
          for (let i = 0; i < sectionElements.length; i++) {
            const el = sectionElements[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportHeight * 0.4) {
                currentIndex = i;
              }
            }
          }
          setActiveSection(currentIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((direction: 'prev' | 'next') => {
    const targetIndex = direction === 'next' 
      ? Math.min(activeSection + 1, sections.length - 1)
      : Math.max(activeSection - 1, 0);
    
    const element = document.getElementById(sections[targetIndex].id);
    if (element) {
      element.scrollIntoView({ 
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  }, [activeSection, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom"
    >
      {/* Progress bar */}
      <div className="h-1 bg-muted relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* Section info and navigation */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Previous button */}
        <button
          onClick={() => scrollToSection('prev')}
          disabled={activeSection === 0}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Previous section"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Current section label */}
        <div className="flex-1 text-center">
          <p className="text-xs text-muted-foreground">
            {activeSection + 1} of {sections.length}
          </p>
          <p className="text-sm font-medium text-foreground truncate px-2">
            {sections[activeSection]?.label}
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={() => scrollToSection('next')}
          disabled={activeSection === sections.length - 1}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Next section"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
});
