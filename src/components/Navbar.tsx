import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "How It Works" },
  { href: "/personal-brand", label: "Personal Brand" },
  { href: "/pricing", label: "Plans" },
] as const;

export const Navbar = memo(function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll listener for navbar background
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Keyboard trap for mobile menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when menu is open
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

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";
  const ctaHref = user ? "/app" : "/contact";
  const ctaLabel = user ? "Dashboard" : "Say Hello";
  
  // Determine navbar style: hero pages get transparent until scrolled
  const showDarkText = !isHeroPage || isScrolled;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm" 
          : isHeroPage 
            ? "bg-transparent" 
            : "bg-background/95 backdrop-blur-xl border-b border-border/50"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className={`font-display text-xl font-bold tracking-display transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-1 ${
              showDarkText 
                ? "text-foreground focus-visible:ring-ring" 
                : "text-white focus-visible:ring-white/50"
            }`}
            aria-label="NÈKO home"
          >
            NÈKO<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isActive
                      ? showDarkText 
                        ? "text-primary bg-primary/5 focus-visible:ring-ring" 
                        : "text-white bg-white/10 focus-visible:ring-white/50"
                      : showDarkText 
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-ring" 
                        : "text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {authLoading ? (
              <>
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </>
            ) : (
              <>
                {!user && (
                  <Link to="/login">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={!showDarkText ? "text-white hover:text-white hover:bg-white/10" : ""}
                    >
                      Log In
                    </Button>
                  </Link>
                )}
                <Link to={ctaHref}>
                  <Button 
                    variant="cta" 
                    size="default"
                    className="shadow-sm"
                  >
                    {ctaLabel}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className={`lg:hidden p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
              showDarkText 
                ? "text-foreground hover:bg-muted focus-visible:ring-ring" 
                : "text-white hover:bg-white/10 focus-visible:ring-white/50"
            }`}
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`lg:hidden fixed inset-x-0 top-16 bottom-0 bg-background border-t border-border transition-all duration-200 ease-out ${
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="container mx-auto px-6 py-4 flex flex-col gap-1 h-full overflow-y-auto">
          <div role="menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={isActive ? "page" : undefined}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            {authLoading ? (
              <>
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </>
            ) : (
              <>
                {!user && (
                  <Link to="/login" onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
                    <Button variant="outline" size="lg" className="w-full">
                      Log In
                    </Button>
                  </Link>
                )}
                <Link to={ctaHref} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
                  <Button variant="cta" size="lg" className="w-full">
                    {ctaLabel}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});
