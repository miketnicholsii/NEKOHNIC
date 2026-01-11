import { memo, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
