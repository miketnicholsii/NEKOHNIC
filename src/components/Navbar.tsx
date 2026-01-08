import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/personal-brand", label: "Personal Brand" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const Navbar = memo(function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  // Scroll listener for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const isHeroPage = location.pathname === "/" || location.pathname === "/about";
  const ctaHref = user ? "/app" : "/signup";
  const ctaLabel = user ? "Dashboard" : "Get Started";
  
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
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/" className="flex items-center gap-2 group">
                  <span className={`font-display text-xl font-bold tracking-display transition-colors duration-300 ${
                    showDarkText ? "text-foreground" : "text-white"
                  }`}>
                    NÈKO.
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                sideOffset={8}
                className="bg-background/95 backdrop-blur-sm border-border/50 px-3 py-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
              >
                <span className="text-sm font-logo tracking-wide text-foreground/80 italic">ē-ko</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg ${
                    isActive
                      ? showDarkText 
                        ? "text-primary bg-primary/5" 
                        : "text-white bg-white/10"
                      : showDarkText 
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!user && (
              <Link to="/login">
                <Button 
                  variant={showDarkText ? "ghost" : "ghost"}
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
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              showDarkText 
                ? "text-foreground hover:bg-muted" 
                : "text-white hover:bg-white/10"
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {!user && (
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" size="lg" className="w-full">
                    Log In
                  </Button>
                </Link>
              )}
              <Link to={ctaHref} onClick={closeMenu}>
                <Button variant="cta" size="lg" className="w-full">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});
