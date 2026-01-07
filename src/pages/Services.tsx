import { motion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { TierCard } from "@/components/TierCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { 
  ArrowRight, 
  Building2, 
  FileText, 
  Landmark, 
  Phone, 
  Mail,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  User,
  TrendingUp
} from "lucide-react";

const businessStarterSteps = [
  {
    id: "llc",
    title: "Registered Business",
    description: "LLC or Corporation properly filed with your state",
    status: "current" as const,
  },
  {
    id: "ein",
    title: "EIN Number",
    description: "Free from IRS.gov — your business's tax ID",
    status: "upcoming" as const,
  },
  {
    id: "bank",
    title: "Business Bank Account",
    description: "Separate your business and personal finances",
    status: "upcoming" as const,
  },
  {
    id: "legitimacy",
    title: "Business Identity",
    description: "Phone, email, and professional presence",
    status: "upcoming" as const,
  },
];

const creditTiers = [
  {
    tier: 0,
    title: "Business Readiness",
    description: "Establish the foundation before building credit",
    features: [
      "Registered LLC or Corporation",
      "EIN from the IRS",
      "Business bank account",
      "Dedicated business phone",
      "Professional business email",
    ],
    status: "unlocked" as const,
  },
  {
    tier: 1,
    title: "Net-30 Vendors",
    description: "Build trade references with vendor accounts",
    features: [
      "Vendor accounts (Uline, Quill, Grainger)",
      "Net-30 payment terms",
      "Reports to business credit bureaus",
      "Build payment history",
      "No personal guarantee required",
    ],
    status: "locked" as const,
  },
  {
    tier: 2,
    title: "Store Credit",
    description: "Graduate to retail and store credit cards",
    features: [
      "Home Depot, Lowes, Staples",
      "Office supply store credit",
      "Revolving credit lines",
      "Higher credit limits",
      "Continued bureau reporting",
    ],
    status: "locked" as const,
  },
  {
    tier: 3,
    title: "Revolving Credit",
    description: "Access business credit cards and lines of credit",
    features: [
      "Business credit cards",
      "Lines of credit",
      "Higher credit limits",
      "Cash back and rewards",
      "Flexible payment options",
    ],
    status: "locked" as const,
  },
];

const legitimacySteps = [
  { icon: Building2, title: "Registered Business", description: "LLC or Corporation properly filed" },
  { icon: FileText, title: "EIN Number", description: "Free from IRS.gov" },
  { icon: Landmark, title: "Business Bank Account", description: "Separate from personal" },
  { icon: Phone, title: "Business Phone", description: "Dedicated line for your business" },
  { icon: Mail, title: "Professional Email", description: "yourname@yourbusiness.com" },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-background">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
              Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-6">
              The path forward.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From formation to credit to brand. Each step structured, trackable, and designed for sustainable progress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business Starter Flow */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <AnimatedSection direction="left">
              <SectionHeading
                label="Start"
                title="Business Formation"
                description="The foundation. A guided path to properly form your business and establish legitimacy from day one."
              />

              <div className="mt-8 space-y-4">
                {legitimacySteps.map((step, index) => (
                  <motion.div 
                    key={step.title} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatedSection delay={0.4} className="mt-8">
                <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-2">Your EIN is free</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Directly from the IRS. We guide you to the official source — we never charge for EIN filing.
                      </p>
                      <a 
                        href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Apply at IRS.gov
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="lg:pl-8">
              <div className="p-8 rounded-2xl bg-card border border-border shadow-md sticky top-28">
                <h3 className="font-display font-bold text-lg mb-6">Your Progress</h3>
                <ProgressTracker steps={businessStarterSteps} />
                <Link to="/contact" className="block mt-6">
                  <Button variant="cta" size="lg" className="w-full group">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Business Credit Builder */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Build"
              title="Business Credit"
              description="Credit is built in stages. Each tier prepares you for the next — with consistency and early payments as the foundation."
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditTiers.map((tier) => (
              <motion.div key={tier.tier} variants={staggerItem}>
                <TierCard
                  tier={tier.tier}
                  title={tier.title}
                  description={tier.description}
                  features={tier.features}
                  status={tier.status}
                />
              </motion.div>
            ))}
          </AnimatedStagger>

          <AnimatedSection delay={0.4} className="mt-12">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 max-w-3xl">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-2">The principle is simple</p>
                  <p className="text-muted-foreground">
                    Pay early. Pay in full. Be consistent. Business credit bureaus reward responsible behavior. There are no shortcuts.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Personal Brand & Scale */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Personal Brand */}
            <AnimatedSection direction="left">
              <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <User className="h-6 w-6" />
                </div>
                <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-2">
                  Brand
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Personal Brand
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Your Digital CV. A professional page that tells your story, showcases your work, and positions you as credible.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Professional personal brand page",
                    "Skills and goals showcase",
                    "Shareable, modern design",
                    "Built for credibility",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/personal-brand">
                  <Button variant="outline" className="group">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Scale */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-2">
                  Scale
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Growth Tools
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Scaling is optional. These resources exist when you're ready — not before.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Advanced progress analytics",
                    "Growth readiness diagnostics",
                    "Social strategy guidance",
                    "Brand audits and upgrades",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button variant="outline" className="group">
                    View Plans
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
              Hello, NÈKO.
            </h2>
            <p className="text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
              Ready to start? All you have to do is say hello.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Say Hello
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
