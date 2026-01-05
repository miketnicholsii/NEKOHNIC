import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { TierCard } from "@/components/TierCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Building2, 
  FileText, 
  Landmark, 
  Phone, 
  Mail,
  CheckCircle2,
  ExternalLink,
  AlertCircle
} from "lucide-react";

const businessStarterSteps = [
  {
    id: "company-info",
    title: "Enter Company Information",
    description: "Name, state of formation, and business goals",
    status: "completed" as const,
  },
  {
    id: "llc-education",
    title: "LLC Formation Education",
    description: "Understand the process and requirements",
    status: "completed" as const,
  },
  {
    id: "ein-guidance",
    title: "Get Your EIN (Free)",
    description: "Direct guidance to IRS.gov for your free EIN",
    status: "current" as const,
  },
  {
    id: "legitimacy",
    title: "Establish Legitimacy",
    description: "Bank account, business email, phone number",
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
      "Uline, Quill, Grainger accounts",
      "Net-30 payment terms",
      "Reports to business credit bureaus",
      "Build payment history",
      "No personal guarantee required",
    ],
    status: "current" as const,
    progress: 35,
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
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
              Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-6">
              Start. Build. Scale.
            </h1>
            <p className="text-xl text-muted-foreground">
              A guided journey from idea to legitimate, credit-worthy business. 
              Every step is structured, trackable, and designed for long-term success.
            </p>
          </div>
        </div>
      </section>

      {/* Business Starter Flow */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <SectionHeading
                label="Step 1: Start"
                title="Business Starter Flow"
                description="A guided experience to properly form your business and establish legitimacy from day one."
              />

              <div className="mt-8 space-y-6">
                {legitimacySteps.map((step) => (
                  <div key={step.title} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* EIN Warning */}
              <div className="mt-8 p-6 rounded-xl bg-secondary/10 border border-secondary/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-2">Important: EIN is FREE</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your Employer Identification Number (EIN) is completely free directly from the IRS. 
                      NEKO guides you to the official IRS website — we never charge for EIN filing.
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
            </div>

            <div className="lg:pl-8">
              <div className="p-8 rounded-2xl bg-card border border-border shadow-md sticky top-28">
                <h3 className="font-display font-bold text-lg mb-6">Your Progress</h3>
                <ProgressTracker steps={businessStarterSteps} />
                <Link to="/get-started" className="block mt-6">
                  <Button variant="cta" size="lg" className="w-full group">
                    Continue Setup
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Credit Builder */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Step 2: Build"
            title="Tiered Business Credit Builder"
            description="Business credit is built in stages, not overnight. Each tier prepares you for the next, with emphasis on legitimacy and early payments."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditTiers.map((tier) => (
              <TierCard
                key={tier.tier}
                tier={tier.tier}
                title={tier.title}
                description={tier.description}
                features={tier.features}
                status={tier.status}
                progress={tier.progress}
              />
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 max-w-3xl">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-2">The Key to Business Credit</p>
                <p className="text-muted-foreground">
                  Pay early, pay in full, and be consistent. Business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business) 
                  reward responsible payment behavior. There are no shortcuts — only smart, strategic steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Brand & Scale */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Personal Brand */}
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border">
              <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
                Step 3: Brand
              </span>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4">
                Personal Brand Builder
              </h2>
              <p className="text-muted-foreground mb-6">
                Create a professional digital presence that tells your story, showcases your skills, 
                and positions you as a credible founder or creator.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Visually appealing personal or brand page",
                  "Digital CV that tells your story",
                  "Skills and goals showcase",
                  "Shareable, modern, intentional design",
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

            {/* Scale */}
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border">
              <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
                Step 4: Scale
              </span>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4">
                Growth & Scale (When Ready)
              </h2>
              <p className="text-muted-foreground mb-6">
                Scaling is optional and should only happen when you're ready. 
                These resources are positioned as supportive tools, not requirements.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Instagram follower growth strategies",
                  "Professional business cards via Moo.com",
                  "Brand audits and upgrades",
                  "Advanced progress tracking",
                  "Growth readiness diagnostics",
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <SectionHeading
            label="Ready to Begin?"
            title="Your journey starts with one step."
            description="Start with our free tier and progress at your own pace. No pressure, no hype — just clear guidance."
            centered
            light
            className="mb-10"
          />
          <Link to="/get-started">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
