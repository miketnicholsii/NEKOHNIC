import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

const NavPill = memo(function NavPill({ 
  href, 
  label, 
  isActive, 
  showDarkText,
  index 
}: { 
  href: string; 
  label: string; 
  isActive: boolean;
  showDarkText: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <Link
        to={href}
        className="relative group"
      >
        <motion.span
          className={`relative z-10 block px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
            isActive
              ? showDarkText ? "text-primary-foreground" : "text-tertiary"
              : showDarkText 
                ? "text-foreground hover:text-primary" 
                : "text-white/90 hover:text-white"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {label}
        </motion.span>
        
        {/* Animated pill background */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="nav-pill"
              className={`absolute inset-0 rounded-full ${
                showDarkText ? "bg-primary" : "bg-white"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {/* Hover effect */}
        <motion.div
          className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isActive ? "" : showDarkText ? "bg-muted/50" : "bg-white/10"
          }`}
        />
      </Link>
    </motion.div>
  );
});

export const EccentricNavbar = memo(function EccentricNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Mouse follower effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });
  const glowOpacity = useTransform(springY, [0, 100], [0.3, 0]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";
  const ctaHref = user ? "/app" : "/signup";
  const ctaLabel = user ? "Dashboard" : "Get Started";
  const showDarkText = !isHeroPage || isScrolled;

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-2" 
            : "py-4"
        }`}
      >
        {/* Background with animated gradient */}
        <motion.div
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled 
              ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-md" 
              : isHeroPage 
                ? "bg-transparent" 
                : "bg-background/80 backdrop-blur-2xl border-b border-border/50"
          }`}
        >
          {/* Animated glow effect on hover */}
          <motion.div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              x: springX,
              y: springY,
              background: `radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)`,
              opacity: showDarkText ? glowOpacity : 0,
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-12 lg:h-14">
            {/* Logo with animation */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className={`font-display text-xl lg:text-2xl font-bold tracking-tight transition-all duration-300 ${
                  showDarkText ? "text-foreground" : "text-white"
                }`}>
                  NÈKO
                  <motion.span
                    className="inline-block ml-0.5"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  >
                    .
                  </motion.span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation - Floating Pill Container */}
            <motion.div 
              className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                background: showDarkText 
                  ? "hsl(var(--muted) / 0.5)" 
                  : "hsl(0 0% 100% / 0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              {navLinks.map((link, index) => (
                <NavPill
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={location.pathname === link.href}
                  showDarkText={showDarkText}
                  index={index}
                />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3 relative z-10">
              {!user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Link to="/login">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={`transition-all duration-300 ${
                        !showDarkText 
                          ? "text-white hover:text-white hover:bg-white/10" 
                          : ""
                      }`}
                    >
                      Log In
                    </Button>
                  </Link>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={ctaHref}>
                  <Button 
                    variant="cta" 
                    size="default"
                    className="relative overflow-hidden group shadow-glow"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {user ? (
                        <>
                          Dashboard
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Get Started
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`lg:hidden p-2.5 rounded-xl transition-colors relative z-10 ${
                showDarkText 
                  ? "text-foreground hover:bg-muted" 
                  : "text-white hover:bg-white/10"
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 pb-8 px-6">
                <nav className="flex-1 space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          to={link.href}
                          onClick={closeMenu}
                          className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:bg-muted hover:translate-x-1"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="space-y-3 pt-6 border-t border-border"
                >
                  {!user && (
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="outline" size="lg" className="w-full">
                        Log In
                      </Button>
                    </Link>
                  )}
                  <Link to={ctaHref} onClick={closeMenu}>
                    <Button variant="cta" size="lg" className="w-full shadow-glow">
                      {ctaLabel}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
