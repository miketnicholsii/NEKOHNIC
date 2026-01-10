import { motion } from "framer-motion";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["Dashboard access", "Basic profile management", "View resources (limited)"],
  starter: ["Everything in Free", "Credit building steps", "Basic tradeline tracking", "Email support"],
  pro: ["Everything in Starter", "Full credit roadmap", "Score monitoring", "Personal brand builder", "Priority support"],
  elite: ["Everything in Pro", "Advanced analytics", "Compliance monitoring", "White-labeled brand page", "1-on-1 strategy calls"],
};

export default function AdminPlans() {
  const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, value]) => ({
    key, ...value, features: PLAN_FEATURES[key] || [],
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">Plans</h1>
        <p className="text-primary-foreground/60">Here's how your subscription tiers are set up.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, index) => (
          <motion.div key={tier.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            className={`bg-primary-foreground/5 border rounded-xl p-5 ${tier.key === "elite" ? "border-secondary/50" : "border-primary-foreground/10"}`}>
            <h3 className="font-semibold text-primary-foreground mb-4">{tier.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary-foreground">${tier.price}</span>
              {tier.price > 0 && <span className="text-primary-foreground/60">/mo</span>}
            </div>
            <div className="space-y-2 mb-4">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
            {tier.product_id && (
              <div className="pt-4 border-t border-primary-foreground/10">
                <p className="text-xs text-primary-foreground/40 font-mono break-all">ID: {tier.product_id}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6">
        <h3 className="font-semibold text-primary-foreground mb-2">Need to Make Changes?</h3>
        <p className="text-primary-foreground/60 text-sm mb-4">To adjust pricing or view subscription analytics, head over to your Stripe Dashboard.</p>
        <Button variant="outline" className="gap-2" onClick={() => window.open("https://dashboard.stripe.com", "_blank")}>
          <ExternalLink className="h-4 w-4" /> Open Stripe Dashboard
        </Button>
      </motion.div>
    </div>
  );
}