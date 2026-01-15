import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/**
 * Unified section definitions for nav scrollspy
 * Single source of truth used by EccentricNavbar, SectionIndicator, and MobileProgressBar
 */
export interface SectionDefinition {
  id: string;
  label: string;
  /** If true, this section appears as a top-level nav item */
  isNavItem: boolean;
  /** Parent nav section for non-nav sections (used for highlight mapping) */
  parentNavId?: string;
}

/**
 * Complete section map for the homepage
 * Order matches the actual page layout
 */
export const HOMEPAGE_SECTIONS: SectionDefinition[] = [
  { id: "hero", label: "Home", isNavItem: true },
  { id: "starting-points", label: "Start", isNavItem: false, parentNavId: "hero" },
  { id: "how-we-help", label: "About", isNavItem: false, parentNavId: "services" },
  { id: "services", label: "Solutions", isNavItem: true },
  { id: "paths", label: "Paths", isNavItem: true },
  { id: "pricing", label: "Pricing", isNavItem: true },
  { id: "experience", label: "Experience", isNavItem: false, parentNavId: "demos" },
  { id: "demos", label: "Demos", isNavItem: true },
  { id: "faq", label: "FAQ", isNavItem: true },
  { id: "cta", label: "Start", isNavItem: false, parentNavId: "faq" },
];

/**
 * Nav links derived from section definitions
 */
export const NAV_LINKS = [
  ...HOMEPAGE_SECTIONS.filter((s) => s.isNavItem).map((s) => ({
    href: `#${s.id}`,
    label: s.label,
    isAnchor: true,
  })),
  { href: "/about", label: "About", isAnchor: false },
] as const;

export type NavHref = (typeof NAV_LINKS)[number]["href"];

/**
 * Hook for tracking the currently active section via IntersectionObserver
 * Returns the nav-level section ID (maps child sections to their parent nav item)
 */
export function useSectionScrollspy(options: {
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number[];
} = {}) {
  const {
    enabled = true,
    rootMargin = "-20% 0px -55% 0px",
    threshold = [0, 0.1, 0.25, 0.5, 0.75, 1],
  } = options;

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const entriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  // All section IDs to observe
  const allSectionIds = useMemo(
    () => HOMEPAGE_SECTIONS.map((s) => s.id),
    []
  );

  // Map of section ID -> nav item ID (for child sections)
  const sectionToNavMap = useMemo(() => {
    const map: Record<string, string> = {};
    HOMEPAGE_SECTIONS.forEach((section) => {
      if (section.isNavItem) {
        map[section.id] = section.id;
      } else if (section.parentNavId) {
        map[section.id] = section.parentNavId;
      }
    });
    return map;
  }, []);

  // Nav item IDs only
  const navSectionIds = useMemo(
    () => HOMEPAGE_SECTIONS.filter((s) => s.isNavItem).map((s) => s.id),
    []
  );

  useEffect(() => {
    if (!enabled) {
      setActiveSection(null);
      return;
    }

    const elements = allSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    entriesRef.current.clear();

    const observer = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((entry) => {
          entriesRef.current.set(entry.target.id, entry);
        });

        // Get all visible sections
        const visible = Array.from(entriesRef.current.values()).filter(
          (entry) => entry.isIntersecting
        );

        if (!visible.length) return;

        // Sort by intersection ratio (highest first), then by vertical position
        visible.sort((a, b) => {
          const ratioCompare = b.intersectionRatio - a.intersectionRatio;
          if (Math.abs(ratioCompare) > 0.1) return ratioCompare;
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

        const detectedSectionId = visible[0]?.target.id;
        if (!detectedSectionId) return;

        // Map to nav-level section
        const navSectionId = sectionToNavMap[detectedSectionId] || detectedSectionId;
        
        // Only update if it's a valid nav section
        if (navSectionIds.includes(navSectionId)) {
          setActiveSection(navSectionId);
        }
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [enabled, allSectionIds, sectionToNavMap, navSectionIds, rootMargin, threshold]);

  return activeSection;
}

/**
 * Hook for tracking scroll position for visibility/styling changes
 */
export function useScrollPosition(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}

/**
 * Smooth scroll to anchor with offset for sticky header
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior, block: "start" });
  }
}
