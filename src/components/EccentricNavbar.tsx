import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/personal-brand", label: "Brand" },
  { href: "/pricing", label: "Pricing" },
] as const;

const NavPill = memo(function NavPill({ href, label, isActive, showDarkText }: { href: string; label: string; isActive: boolean; showDarkText: boolean }) {
  return (
    <Link to={href} className="relative group">
      <span className={`relative z-10 block px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${isActive ? (showDarkText ? "text-primary-foreground" : "text-tertiary") : showDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
        {label}
      </span>
      {isActive && (
        <motion.div layoutId="nav-pill" className={`absolute inset-0 rounded-full ${showDarkText ? "bg-primary" : "bg-white"}`} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
      {!isActive && <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${showDarkText ? "bg-muted/50" : "bg-white/10"}`} />}
    </Link>
  );
});

export const EccentricNavbar = memo(function EccentricNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";
  const showDarkText = !isHeroPage || isScrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-3 sm:py-4"}`}>
        <div className={`absolute inset-0 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-sm" : isHeroPage ? "bg-transparent" : "bg-background/90 backdrop-blur-lg border-b border-border/50"}`} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-11 lg:h-12">
            <Link to="/" className="flex items-center relative z-10 flex-shrink-0">
              <span className={`font-display text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-200 ${showDarkText ? "text-foreground" : "text-white"}`}>NÈKO<span className="text-primary">.</span></span>
            </Link>

            {/* Centered navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-full" style={{ background: showDarkText ? "hsl(var(--muted) / 0.5)" : "hsl(0 0% 100% / 0.1)", backdropFilter: "blur(8px)" }}>
                {navLinks.map((link) => (
                  <NavPill key={link.href} href={link.href} label={link.label} isActive={location.pathname === link.href} showDarkText={showDarkText} />
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 relative z-10 flex-shrink-0">
              {user ? (
                <Link to="/app">
                  <Button variant="cta" size="default" className="shadow-md">
                    <span className="flex items-center gap-1.5">
                      Dashboard <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`text-sm font-medium transition-colors hover:opacity-80 ${showDarkText ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
                  >
                    Member Login
                  </Link>
                  <Link to="/contact">
                    <Button variant="cta" size="default" className="shadow-md">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> Get in Touch
                      </span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className={`lg:hidden p-2 rounded-lg transition-colors relative z-10 ${showDarkText ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`} onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" onClick={closeMenu} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 350, damping: 35 }} className="absolute right-0 top-0 h-full w-full max-w-xs bg-card border-l border-border shadow-xl">
              <div className="flex flex-col h-full pt-16 pb-6 px-5">
                <nav className="flex-1 space-y-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} to={link.href} onClick={closeMenu} className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === link.href ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"}`}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="space-y-2.5 pt-4 border-t border-border">
                  {user ? (
                    <Link to="/app" onClick={closeMenu}>
                      <Button variant="cta" size="lg" className="w-full">Dashboard</Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/contact" onClick={closeMenu}>
                        <Button variant="cta" size="lg" className="w-full">Get in Touch</Button>
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