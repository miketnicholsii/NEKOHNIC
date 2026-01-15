import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { 
  NAV_LINKS, 
  useSectionScrollspy, 
  useScrollPosition, 
  scrollToSection 
} from "@/hooks/use-section-scrollspy";

// Simplified nav pill with anchor support
const NavPill = memo(function NavPill({ 
  href, 
  label, 
  isActive, 
  showDarkText,
  isAnchor,
  onAnchorClick,
}: { 
  href: string; 
  label: string; 
  isActive: boolean; 
  showDarkText: boolean;
  isAnchor: boolean;
  onAnchorClick?: (id: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (isAnchor && onAnchorClick) {
      e.preventDefault();
      const id = href.replace("#", "");
      onAnchorClick(id);
    }
  };

  if (isAnchor) {
    return (
      <a 
        href={href} 
        onClick={handleClick}
        aria-current={isActive ? "location" : undefined}
        className="relative group cursor-pointer"
      >
        <span className={`relative z-10 block px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-sm 2xl:text-base font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? (showDarkText ? "text-primary-foreground" : "text-tertiary") : showDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
          {label}
        </span>
        {isActive && (
          <motion.div 
            layoutId="nav-active-pill"
            className={`absolute inset-0 rounded-full transition-colors duration-200 ${showDarkText ? "bg-primary" : "bg-white"}`}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        {!isActive && <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${showDarkText ? "bg-muted/50" : "bg-white/10"}`} />}
      </a>
    );
  }

  return (
    <Link to={href} className="relative group" aria-current={isActive ? "page" : undefined}>
      <span className={`relative z-10 block px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-sm 2xl:text-base font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? (showDarkText ? "text-primary-foreground" : "text-tertiary") : showDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="nav-active-pill"
          className={`absolute inset-0 rounded-full transition-colors duration-200 ${showDarkText ? "bg-primary" : "bg-white"}`}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      {!isActive && <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${showDarkText ? "bg-muted/50" : "bg-white/10"}`} />}
    </Link>
  );
});

export const EccentricNavbar = memo(function EccentricNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use unified scrollspy hook
  const isHome = location.pathname === "/";
  const activeSection = useSectionScrollspy({ enabled: isHome });
  const isScrolled = useScrollPosition(20);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleAnchorClick = useCallback((id: string) => {
    const targetHash = `#${id}`;
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: targetHash });
    } else if (location.hash !== targetHash) {
      navigate({ hash: targetHash });
    } else {
      scrollToSection(id, "smooth");
    }
    closeMenu();
  }, [closeMenu, location.hash, location.pathname, navigate]);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";
  const showDarkText = !isHeroPage || isScrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${isScrolled ? "py-2" : "py-3 sm:py-4"}`}
        aria-label="Main navigation"
      >
        <div className={`absolute inset-0 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-sm" : isHeroPage ? "bg-transparent" : "bg-background/90 backdrop-blur-lg border-b border-border/50"}`} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-11 lg:h-12 min-w-0">
            {/* Left side - Logo */}
            <div className="hidden lg:flex items-center w-48 xl:w-56 flex-shrink-0">
              <Link to="/" className="flex items-center relative z-10" title="NÈKO - pronounced 'ē-ko'">
                <span className={`font-display text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-200 ${showDarkText ? "text-foreground" : "text-white"}`}>NÈKO<span className="text-primary">.</span></span>
              </Link>
            </div>
            
            {/* Mobile logo */}
            <Link to="/" className="flex lg:hidden items-center relative z-10 flex-shrink-0" title="NÈKO - pronounced 'ē-ko'">
              <span className={`font-display text-xl font-bold tracking-tight transition-colors duration-200 ${showDarkText ? "text-foreground" : "text-white"}`}>NÈKO<span className="text-primary">.</span></span>
            </Link>

            {/* Centered navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2">
              <motion.div
                layout
                className="flex items-center flex-nowrap gap-0.5 lg:gap-1 xl:gap-1.5 px-1.5 py-1 rounded-full max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ background: showDarkText ? "hsl(var(--muted) / 0.5)" : "hsl(0 0% 100% / 0.1)", backdropFilter: "blur(8px)" }}
              >
                {NAV_LINKS.map((link) => (
                  <NavPill 
                    key={link.href} 
                    href={link.href} 
                    label={link.label} 
                    isActive={link.isAnchor ? activeSection === link.href.replace("#", "") : (!link.isAnchor && location.pathname === link.href)} 
                    showDarkText={showDarkText}
                    isAnchor={link.isAnchor}
                    onAnchorClick={handleAnchorClick}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right side - CTAs (simplified - no Get Started button, only login) */}
            <div className="hidden lg:flex items-center justify-end gap-3 min-w-fit flex-shrink-0 relative z-10">
              {user ? (
                <>
                  <span className={`text-xs font-medium ${showDarkText ? "text-muted-foreground" : "text-white/60"}`}>
                    Signed in as <span className={`font-semibold ${showDarkText ? "text-foreground" : "text-white/90"}`}>{user.email?.split('@')[0]}</span>
                  </span>
                  <Link to="/app">
                    <Button variant="cta" size="default" className="shadow-md">
                      <span className="flex items-center gap-1.5">
                        Dashboard <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80 ${showDarkText ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
                >
                  Member Login
                </Link>
              )}
            </div>

            <button
              ref={menuButtonRef}
              className={`lg:hidden p-2 rounded-lg transition-colors relative z-10 ${showDarkText ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" onClick={closeMenu} />
            <motion.div
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="absolute right-0 top-0 h-full w-full max-w-xs bg-card border-l border-border shadow-xl"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full pt-16 pb-6 px-5">
                <nav className="flex-1 space-y-1" aria-label="Primary">
                  {NAV_LINKS.map((link) => {
                    const anchorActive = activeSection === link.href.replace("#", "");
                    const routeActive = !link.isAnchor && location.pathname === link.href;
                    const isActive = link.isAnchor ? anchorActive : routeActive;

                    return link.isAnchor ? (
                      <a 
                        key={link.href} 
                        href={link.href} 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAnchorClick(link.href.replace("#", ""));
                        }}
                        aria-current={isActive ? "location" : undefined}
                        className={`block px-3 py-3 rounded-lg text-base font-medium whitespace-nowrap transition-colors ${isActive ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        key={link.href} 
                        to={link.href} 
                        onClick={closeMenu}
                        aria-current={isActive ? "page" : undefined}
                        className={`block px-3 py-3 rounded-lg text-base font-medium whitespace-nowrap transition-colors ${isActive ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="space-y-2.5 pt-4 border-t border-border">
                  {user ? (
                    <>
                      <p className="text-xs text-muted-foreground text-center pb-1">
                        Signed in as <span className="font-semibold text-foreground">{user.email?.split('@')[0]}</span>
                      </p>
                      <Link to="/app" onClick={closeMenu}>
                        <Button variant="cta" size="lg" className="w-full">Dashboard</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/contact" onClick={closeMenu}>
                        <Button variant="cta" size="lg" className="w-full">Say Hello</Button>
                      </Link>
                      <Link 
                        to="/login" 
                        onClick={closeMenu}
                        className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        Member Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
