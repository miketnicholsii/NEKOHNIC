import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { InstagramSection } from "./InstagramSection";

const footerLinks = {
  platform: [
    { href: "/services", label: "Services" },
    { href: "/personal-brand", label: "Personal Brand" },
    { href: "/pricing", label: "Pricing" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/get-started", label: "Contact" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
  ],
};

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="bg-tertiary text-tertiary-foreground">
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-2xl font-bold tracking-display text-primary-foreground">
                NÈKO.
              </span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Your guided operating system for building businesses and personal brands — from idea to scale.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-primary-foreground mb-6 uppercase">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-primary-foreground mb-6 uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-primary-foreground mb-6 uppercase">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-primary-foreground mb-6 uppercase">
              Instagram
            </h4>
            <InstagramSection />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/40 tracking-wide">
              © {new Date().getFullYear()} NÈKO. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/40 tracking-wide">
              BUSINESS. | TECH. | STRATEGY.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
