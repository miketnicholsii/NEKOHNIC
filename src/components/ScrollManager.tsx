import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * ScrollManager handles scroll position restoration and scroll-to-top behavior.
 * - On route PUSH/REPLACE: scrolls to top (or hash target)
 * - On route POP (back/forward): restores previous scroll position
 * - Fixes breakout pages loading at bottom
 */
export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const positionsRef = useRef<Map<string, number>>(new Map());
  const isFirstRender = useRef(true);
  const prefersReducedMotion = useRef(false);

  // Track scroll position for current location
  useEffect(() => {
    const key = location.key;
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          positionsRef.current.set(key, window.scrollY || window.pageYOffset || 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;

    const updatePreference = () => {
      prefersReducedMotion.current = media.matches;
    };

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  // Handle scroll position on navigation
  useEffect(() => {
    const key = location.key;
    const hash = location.hash;
    const id = hash ? decodeURIComponent(hash.replace("#", "")) : null;

    const scrollToHash = (behavior: ScrollBehavior) => {
      if (!id) return false;
      const el = document.getElementById(id);
      if (!el) return false;
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior, block: "start" });
      });
      return true;
    };

    // Skip scroll handling on first render if we're at the top already
    // This prevents flash of content jumping
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // On first render, handle hash or scroll to top
      if (scrollToHash("auto")) return;
      
      // Ensure we start at top on first load for non-hash routes
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Handle back/forward navigation - restore position
    if (navType === "POP") {
      const y = positionsRef.current.get(key);
      if (typeof y === "number") {
        // Use requestAnimationFrame to ensure smooth restoration
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, left: 0, behavior: "auto" });
        });
        return;
      }
    }

    // Handle hash navigation (anchor links)
    if (id) {
      const behavior = prefersReducedMotion.current ? "auto" : "smooth";
      if (scrollToHash(behavior)) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Default: scroll to top for new navigation (PUSH/REPLACE)
    // This fixes breakout pages loading at bottom
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash, location.key, navType]);

  return null;
}
