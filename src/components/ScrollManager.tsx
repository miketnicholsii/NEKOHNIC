import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollManager handles scroll position and anchor alignment.
 * - On pathname/search change: scrolls to top (or hash target)
 * - On hash navigation: scrolls to the anchor with proper offset
 * - Fixes breakout pages loading at bottom
 */
export default function ScrollManager() {
  const location = useLocation();
  const prefersReducedMotion = useRef(false);
  const lastPathRef = useRef<string | null>(null);

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
    const pathKey = `${location.pathname}${location.search}`;
    const pathChanged = lastPathRef.current !== pathKey;
    if (pathChanged) {
      lastPathRef.current = pathKey;
    }

    const hash = location.hash;
    const id = hash ? decodeURIComponent(hash.replace("#", "")) : null;
    const behavior = prefersReducedMotion.current ? "auto" : "smooth";

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const scrollToHash = () => {
      if (!id) return false;
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior, block: "start" });
      return true;
    };

    if (id) {
      let attempts = 0;
      const tryScroll = () => {
        if (scrollToHash()) return;
        attempts += 1;
        if (attempts < 12) {
          requestAnimationFrame(tryScroll);
        } else if (pathChanged) {
          scrollToTop();
        }
      };
      requestAnimationFrame(tryScroll);
      return;
    }

    if (pathChanged) {
      scrollToTop();
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}
