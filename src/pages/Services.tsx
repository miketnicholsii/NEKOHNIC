import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
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
    description: "Start building trade references with vendor accounts",
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
      <Navbar />

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
              Start. Build. Scale.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A guided journey from idea to legitimate, credit-worthy business. Every step is structured, trackable, and built for long-term success.
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
                label="Step 1: Start"
                title="Business Starter Flow"
                description="A guided experience to properly form your business and establish legitimacy from day one."
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
                      <p className="font-medium text-foreground mb-2">Important: EIN is FREE</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your Employer Identification Number (EIN) is completely free directly from the IRS. NÈKO guides you to the official IRS website — we never charge for EIN filing.
                      </p>
                      <a 
                        href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Apply for EIN at IRS.gov
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
                <Link to="/signup" className="block mt-6">
                  <Button variant="cta" size="lg" className="w-full group">
                    Continue Setup
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
              label="Step 2: Build"
              title="Tiered Business Credit Builder"
              description="Business credit is built in stages, not overnight. Each tier prepares you for the next, with emphasis on legitimacy and early payments."
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
                  <p className="font-medium text-foreground mb-2">The Key to Business Credit</p>
                  <p className="text-muted-foreground">
                    Pay early, pay in full, and be consistent. Business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business) reward responsible payment behavior. There are no shortcuts — only smart, strategic steps.
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
                  Step 3: Brand
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Personal Brand Builder
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Create your Digital CV — a professional page that tells your story, showcases your skills, and positions you as a credible founder or creator.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Professional personal brand page",
                    "Digital CV that tells your story",
                    "Skills and goals showcase",
                    "Shareable, modern design",
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
                  Step 4: Scale
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Growth & Scale
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Scaling is optional and should only happen when you're ready. These resources are supportive tools, not requirements.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Advanced progress analytics",
                    "Growth readiness diagnostics",
                    "Instagram & social strategies",
                    "Professional business cards",
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
      <section className="py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <SectionHeading
              label="Ready to Begin?"
              title="Your journey starts with one step."
              description="Start with our free tier and progress at your own pace. No pressure, no hype — just clear guidance."
              centered
              light
              className="mb-10"
            />
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
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
