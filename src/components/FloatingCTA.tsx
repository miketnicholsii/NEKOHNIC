import { memo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Floating CTA that appears after user scrolls past the hero section.
 * Encourages exploration first, then presents the "Get Started" CTA.
 */
export const FloatingCTA = memo(function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  // Only show on marketing pages, not in the app
  const isMarketingPage = !location.pathname.startsWith("/app") && 
                          !location.pathname.startsWith("/admin") &&
                          !location.pathname.startsWith("/login") &&
                          !location.pathname.startsWith("/signup") &&
                          !location.pathname.startsWith("/forgot-password");

  useEffect(() => {
    if (!isMarketingPage || user) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Show after scrolling past ~80% of viewport height (past the hero)
          const threshold = window.innerHeight * 0.8;
          setIsVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMarketingPage, user]);

  // Don't render for logged-in users or on app pages
  if (user || !isMarketingPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden sm:block"
          role="complementary"
          aria-label="Quick action"
        >
          <Link to="/contact">
            <Button 
              variant="cta" 
              size="lg" 
              className="shadow-xl group"
              aria-label="Contact us - Say Hello"
            >
              <span className="flex items-center gap-2">
                Say Hello
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
