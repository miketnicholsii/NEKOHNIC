import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/personal-brand", label: "Personal Brand" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";

  // Determine CTA destination based on auth status
  const ctaHref = user ? "/app" : "/signup";
  const ctaLabel = user ? "Dashboard" : "Get Started";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeroPage ? "bg-transparent" : "glass"}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className={`font-display text-xl font-bold tracking-display ${isHeroPage ? "text-primary-foreground" : "text-foreground"}`}>
              NÈKO.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:opacity-80 ${
                  location.pathname === link.href
                    ? isHeroPage ? "text-primary-foreground" : "text-primary"
                    : isHeroPage ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {!user && (
              <Link to="/login">
                <Button 
                  variant={isHeroPage ? "hero-outline" : "ghost"} 
                  size="default"
                >
                  Log In
                </Button>
              </Link>
            )}
            <Link to={ctaHref}>
              <Button variant={isHeroPage ? "hero" : "cta"} size="lg">
                {ctaLabel}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${isHeroPage ? "text-primary-foreground" : "text-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass-dark animate-slide-up">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium tracking-wide py-2 transition-colors ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-primary-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              {!user && (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="hero-outline" size="lg" className="w-full">
                    Log In
                  </Button>
                </Link>
              )}
              <Link to={ctaHref} onClick={() => setIsOpen(false)}>
                <Button variant="hero" size="lg" className="w-full">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
