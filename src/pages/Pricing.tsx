import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { PricingCard } from "@/components/PricingCard";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { CheckCircle2, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingPlans = [
  {
    name: "Free",
    description: "Get started and explore",
    price: "Free",
    features: [
      "Business starter checklist",
      "EIN guidance & IRS links",
      "High-level credit roadmap",
      "Limited progress tracking",
      "Preview personal brand page",
    ],
    ctaText: "Start Free",
  },
  {
    name: "Start",
    description: "For early-stage founders",
    price: "$19",
    features: [
      "Everything in Free",
      "Guided business setup flow",
      "Editable progress tracking",
      "Tier-1 credit education",
      "Basic personal brand page",
      "Email support",
    ],
    ctaText: "Get Started",
  },
  {
    name: "Build",
    description: "For serious builders",
    price: "$49",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Start",
      "Full tiered credit roadmap",
      "Visual milestone tracking",
      "Vendor guidance & resources",
      "Expanded personal brand page",
      "Business identity guidance",
      "Moo.com integration",
    ],
    ctaText: "Start Building",
  },
  {
    name: "Scale",
    description: "For growth-ready businesses",
    price: "$99",
    features: [
      "Everything in Build",
      "Advanced progress analytics",
      "Growth readiness diagnostics",
      "Optional growth tools",
      "Priority support",
      "White-labeled brand pages",
      "Team collaboration (coming)",
    ],
    ctaText: "Start Scaling",
  },
];

const faqs = [
  {
    question: "Is this a credit repair service?",
    answer: "No. NEKO is not a credit repair service. We focus on building business credit through legitimate means — proper business formation, vendor accounts, and responsible payment behavior. We do not repair personal credit or make promises about credit scores.",
  },
  {
    question: "Do you charge for EIN filing?",
    answer: "Absolutely not. Your EIN is free directly from the IRS. NEKO provides guidance and links to the official IRS website, but we never charge for EIN filing. Be wary of any service that does.",
  },
  {
    question: "Is NEKO a get-rich-quick program?",
    answer: "No. Building a legitimate business takes time, effort, and patience. NEKO provides structure and education — not shortcuts. Our approach emphasizes doing things the right way for long-term success.",
  },
  {
    question: "Do I need to start with a paid plan?",
    answer: "No. Our Free tier includes the business starter checklist, EIN guidance, and a high-level credit roadmap. You can explore and learn before committing to a paid plan.",
  },
  {
    question: "What makes NEKO different from other business tools?",
    answer: "NEKO is a guided operating system — not just a tool. We focus on the entire journey from idea to scale, with structured progress tracking, education at every step, and an emphasis on legitimacy over hacks.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. All paid plans are month-to-month with no long-term commitment. You can cancel anytime from your account settings.",
  },
];

const comparisonFeatures = [
  { feature: "Business starter checklist", free: true, start: true, build: true, scale: true },
  { feature: "EIN guidance & IRS links", free: true, start: true, build: true, scale: true },
  { feature: "High-level credit roadmap", free: true, start: true, build: true, scale: true },
  { feature: "Progress tracking", free: "Limited", start: true, build: true, scale: "Advanced" },
  { feature: "Personal brand page", free: "Preview", start: "Basic", build: "Expanded", scale: "White-labeled" },
  { feature: "Guided business setup", free: false, start: true, build: true, scale: true },
  { feature: "Full credit roadmap", free: false, start: false, build: true, scale: true },
  { feature: "Vendor guidance", free: false, start: false, build: true, scale: true },
  { feature: "Growth tools", free: false, start: false, build: false, scale: true },
  { feature: "Priority support", free: false, start: false, build: false, scale: true },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
              Pricing
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-6 max-w-3xl mx-auto">
              Simple, transparent pricing.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, no surprises — just clear value at every tier.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem}>
                <PricingCard
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  badge={plan.badge}
                  ctaText={plan.ctaText}
                />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Compare Plans"
              title="Find the right fit."
              description="See what's included in each tier at a glance."
              centered
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto bg-card rounded-2xl border border-border overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                    <th className="text-center p-4 font-display font-bold text-foreground">Free</th>
                    <th className="text-center p-4 font-display font-bold text-foreground">Start</th>
                    <th className="text-center p-4 font-display font-bold text-primary bg-primary/5">Build</th>
                    <th className="text-center p-4 font-display font-bold text-foreground">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={row.feature} className={index < comparisonFeatures.length - 1 ? "border-b border-border" : ""}>
                      <td className="p-4 text-sm text-foreground">{row.feature}</td>
                      <td className="text-center p-4">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.free}</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {typeof row.start === "boolean" ? (
                          row.start ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.start}</span>
                        )}
                      </td>
                      <td className="text-center p-4 bg-primary/5">
                        {typeof row.build === "boolean" ? (
                          row.build ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.build}</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {typeof row.scale === "boolean" ? (
                          row.scale ? (
                            <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.scale}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="FAQ"
              title="Common questions."
              centered
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 pl-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
