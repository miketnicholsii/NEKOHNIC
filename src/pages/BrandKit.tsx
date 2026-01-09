import { memo, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { Download, Copy, Check, FileImage, Palette, Type, Share2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint" aria-hidden="true">
      <div className="absolute top-1/3 left-[20%] w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-[15%] w-40 sm:w-56 h-40 sm:h-56 bg-primary/5 rounded-full blur-3xl opacity-50" />
    </div>
  );
});

// Color tokens from the design system
const brandColors = [
  { name: "Primary", token: "--primary", hex: "#2A9D8F", description: "Sophisticated Teal" },
  { name: "Primary Glow", token: "--primary-glow", hex: "#3AB7A8", description: "Accent Teal" },
  { name: "Tertiary", token: "--tertiary", hex: "#0D2B38", description: "Rich Navy" },
  { name: "Background", token: "--background", hex: "#FFFFFF", description: "Clean White" },
  { name: "Foreground", token: "--foreground", hex: "#162A33", description: "Dark Text" },
  { name: "Muted", token: "--muted", hex: "#F5F7F8", description: "Subtle Gray" },
  { name: "Border", token: "--border", hex: "#E8ECEE", description: "Soft Border" },
  { name: "Accent Gold", token: "--accent-gold", hex: "#E6A84D", description: "Warm Gold" },
];

// Logo assets
const logoAssets = [
  {
    name: "NÈKO Logo",
    description: "Primary wordmark",
    preview: "/brand/neko-logo-light.png",
    darkPreview: "/brand/neko-logo-dark.png",
    downloads: [
      { label: "SVG", path: "/brand/neko-logo.svg" },
      { label: "PNG (Light)", path: "/brand/neko-logo-light.png" },
      { label: "PNG (Dark)", path: "/brand/neko-logo-dark.png" },
    ],
  },
  {
    name: "NÈKO Mark",
    description: "Icon / App mark",
    preview: "/brand/neko-mark-light.png",
    darkPreview: "/brand/neko-mark-dark.png",
    downloads: [
      { label: "SVG", path: "/brand/neko-mark.svg" },
      { label: "PNG (Light)", path: "/brand/neko-mark-light.png" },
      { label: "PNG (Dark)", path: "/brand/neko-mark-dark.png" },
    ],
  },
];

const usageRules = [
  "Don't stretch or distort.",
  "Keep safe padding around the logo.",
  "Use official colors only.",
  "Maintain legibility at all sizes.",
  "When in doubt, say hello.",
];

const wittyQuotes = [
  "NÈKO says hi.",
  "Use responsibly.",
  "Be kind to pixels.",
  "Say hello.",
];

// Color swatch component
const ColorSwatch = memo(function ColorSwatch({ 
  color 
}: { 
  color: typeof brandColors[0] 
}) {
  const [copied, setCopied] = useState(false);

  const copyHex = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    toast.success(`Copied ${color.hex}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div 
        className="h-20 sm:h-24 w-full transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: color.hex }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display font-semibold text-foreground text-sm">{color.name}</p>
            <p className="text-xs text-muted-foreground">{color.description}</p>
          </div>
          <button
            onClick={copyHex}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label={`Copy ${color.hex}`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{color.hex}</p>
      </div>
    </div>
  );
});

// Logo card component
const LogoCard = memo(function LogoCard({ 
  asset 
}: { 
  asset: typeof logoAssets[0] 
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Preview on light */}
      <div className="bg-white p-6 sm:p-8 flex items-center justify-center min-h-[120px]">
        <img 
          src={asset.preview} 
          alt={`${asset.name} on light background`}
          className="max-h-16 sm:max-h-20 w-auto object-contain"
        />
      </div>
      {/* Preview on dark */}
      <div className="bg-tertiary p-6 sm:p-8 flex items-center justify-center min-h-[120px]">
        <img 
          src={asset.darkPreview} 
          alt={`${asset.name} on dark background`}
          className="max-h-16 sm:max-h-20 w-auto object-contain"
        />
      </div>
      {/* Info & Downloads */}
      <div className="p-5 border-t border-border">
        <h3 className="font-display font-bold text-foreground mb-1">{asset.name}</h3>
        <p className="text-xs text-muted-foreground mb-4">{asset.description}</p>
        <div className="flex flex-wrap gap-2">
          {asset.downloads.map((dl) => (
            <a
              key={dl.label}
              href={dl.path}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-primary/10 text-foreground hover:text-primary transition-colors"
            >
              <Download className="h-3 w-3" />
              {dl.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

export default function BrandKit() {
  const prefersReducedMotion = useReducedMotion();
  
  const fadeIn = useMemo(() => prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: {} }
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOutExpo }
      }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 bg-background relative">
        <HeroBackground />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            {...fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-4 sm:mb-6">
              Brand Kit
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2 sm:px-0 mb-8">
              Logos, colors, and assets.
            </p>
            <p className="text-xs text-muted-foreground/60 italic">
              {wittyQuotes[0]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Logo Assets */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Logos"
              title="Brand marks."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {logoAssets.map((asset) => (
              <motion.div key={asset.name} variants={staggerItem}>
                <LogoCard asset={asset} />
              </motion.div>
            ))}
          </AnimatedStagger>

          <AnimatedSection delay={0.2}>
            <p className="text-center text-xs text-muted-foreground/60 mt-8 italic">
              {wittyQuotes[2]}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Colors */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Colors"
              title="Brand palette."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {brandColors.map((color) => (
              <motion.div key={color.name} variants={staggerItem}>
                <ColorSwatch color={color} />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Typography */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Typography"
              title="Brand fonts."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Font */}
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Type className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">Instrument Sans</p>
                    <p className="text-xs text-muted-foreground">Display / Headlines</p>
                  </div>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  The quick brown fox.
                </p>
                <p className="font-display text-lg text-muted-foreground mt-2">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                </p>
              </div>

              {/* Body Font */}
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Type className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">DM Sans</p>
                    <p className="text-xs text-muted-foreground">Body / UI</p>
                  </div>
                </div>
                <p className="font-sans text-lg sm:text-xl text-foreground">
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="font-sans text-base text-muted-foreground mt-2">
                  abcdefghijklmnopqrstuvwxyz
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social / OG Image */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Social"
              title="Sharing assets."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="bg-tertiary p-4">
                  <img 
                    src="/og-neko.png" 
                    alt="NÈKO Open Graph Image"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-foreground">OG Image</h3>
                    <p className="text-xs text-muted-foreground">1200 × 630 — Social sharing</p>
                  </div>
                  <a
                    href="/og-neko.png"
                    download="neko-og-image.png"
                    className="inline-flex items-center gap-2"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-center text-xs text-muted-foreground/60 mt-8 italic">
              {wittyQuotes[1]}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Usage"
              title="Simple rules."
              centered
              className="mb-8 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-md mx-auto">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <ul className="space-y-3">
                  {usageRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-center text-xs text-muted-foreground/60 mt-8 italic">
              {wittyQuotes[3]}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-tertiary-foreground mb-4">
                Questions?
              </h2>
              <p className="text-tertiary-foreground/60 text-sm sm:text-base mb-8">
                Reach out if you need anything else.
              </p>
              <Button variant="cta" size="lg" asChild>
                <a href="/contact">
                  Get in Touch
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
