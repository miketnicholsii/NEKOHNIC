import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { InstagramSection } from "./InstagramSection";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  platform: [
    { href: "/services", label: "Services" },
    { href: "/personal-brand", label: "Personal Brand" },
    { href: "/pricing", label: "Pricing" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Get in Touch" },
    { href: "/login", label: "Member Login" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/terms", label: "Terms" },
  ],
};

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="relative bg-tertiary text-tertiary-foreground overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" aria-hidden="true" />
      
      <div className="relative container mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-4 sm:mb-6 group">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground transition-all duration-300 group-hover:text-primary">
                NÈKO.
              </span>
            </Link>
            <p className="text-primary-foreground/60 text-xs sm:text-sm leading-relaxed max-w-sm mb-4 sm:mb-6">
              A guided operating system for building legitimate businesses and personal brands.
            </p>
            <p className="text-primary-foreground/40 text-[10px] sm:text-xs leading-relaxed max-w-sm">
              Structure. Education. Clarity.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-display text-[10px] sm:text-xs font-bold tracking-wider text-primary-foreground/80 mb-4 sm:mb-6 uppercase">
              Platform
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-xs sm:text-sm text-primary-foreground/60 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-[10px] sm:text-xs font-bold tracking-wider text-primary-foreground/80 mb-4 sm:mb-6 uppercase">
              Company
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-xs sm:text-sm text-primary-foreground/60 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5 sm:space-y-3.5 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary-foreground/10">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-[10px] sm:text-xs text-primary-foreground/40 hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-display text-[10px] sm:text-xs font-bold tracking-wider text-primary-foreground/80 mb-4 sm:mb-6 uppercase">
              Connect
            </h4>
            <InstagramSection />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-primary-foreground/40 tracking-wide">
              © {new Date().getFullYear()} NÈKO. All rights reserved.
            </p>
            <p className="text-[10px] sm:text-xs text-primary-foreground/40 tracking-wide">
              Hello, NÈKO.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
