import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { PricingCard } from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingPlans = [
  {
    name: "Free",
    description: "Explore the path",
    price: "Free",
    features: [
      "Business starter checklist",
      "EIN guidance & IRS links",
      "High-level credit roadmap",
      "Limited progress tracking",
      "Preview personal brand page",
    ],
  },
  {
    name: "Start",
    description: "Early-stage founders",
    price: "$29",
    features: [
      "Everything in Free",
      "Guided business setup",
      "Editable progress tracking",
      "Tier-1 credit education",
      "Basic personal brand page",
      "Email support",
    ],
  },
  {
    name: "Build",
    description: "Serious builders",
    price: "$79",
    highlighted: true,
    badge: "Popular",
    features: [
      "Everything in Start",
      "Full tiered credit roadmap",
      "Visual milestone tracking",
      "Vendor guidance & resources",
      "Expanded personal brand page",
      "Business identity guidance",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    description: "Growth-ready",
    price: "$149",
    features: [
      "Everything in Build",
      "Advanced analytics",
      "Growth diagnostics",
      "Optional growth tools",
      "White-labeled brand pages",
      "Team collaboration (coming)",
    ],
  },
];

const faqs = [
  {
    question: "How do I get started?",
    answer: "Just say hello. Request access through our contact page and we'll be in touch within 24 hours to get you set up with the right plan for your journey.",
  },
  {
    question: "Is this a credit repair service?",
    answer: "No. NÈKO focuses on building business credit through legitimate means — proper business formation, vendor accounts, and responsible payment behavior. We do not repair personal credit.",
  },
  {
    question: "Do you charge for EIN filing?",
    answer: "Never. Your EIN is free directly from the IRS. We provide guidance and links to the official IRS website. Be wary of any service that charges for this.",
  },
  {
    question: "Is NÈKO a get-rich-quick program?",
    answer: "No. Building a legitimate business takes time, effort, and patience. NÈKO provides structure and education — not shortcuts.",
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
  { feature: "Personal brand page", free: "Preview", start: "Basic", build: "Expanded", scale: "White-label" },
  { feature: "Guided business setup", free: false, start: true, build: true, scale: true },
  { feature: "Full credit roadmap", free: false, start: false, build: true, scale: true },
  { feature: "Vendor guidance", free: false, start: false, build: true, scale: true },
  { feature: "Growth tools", free: false, start: false, build: false, scale: true },
  { feature: "Priority support", free: false, start: false, build: true, scale: true },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-background">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-6">
              Say hello.
            </h1>
            <p className="text-lg text-muted-foreground">
              All it takes to start is a simple hello. Choose your path and we'll guide you from there.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem} className="flex">
                <PricingCard
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  badge={plan.badge}
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Compare"
              title="Find the right fit."
              centered
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto bg-card rounded-xl border border-border overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Feature</th>
                    <th className="text-center p-4 font-display font-bold text-foreground text-sm">Free</th>
                    <th className="text-center p-4 font-display font-bold text-foreground text-sm">Start</th>
                    <th className="text-center p-4 font-display font-bold text-primary text-sm bg-primary/5">Build</th>
                    <th className="text-center p-4 font-display font-bold text-foreground text-sm">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={row.feature} className={index < comparisonFeatures.length - 1 ? "border-b border-border" : ""}>
                      <td className="p-4 text-sm text-foreground">{row.feature}</td>
                      <td className="text-center p-4">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
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
                            <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
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
                            <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
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
                            <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
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
      <section className="py-20 lg:py-28 bg-background">
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
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-lg px-5 data-[state=open]:shadow-sm transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 pl-7 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
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
