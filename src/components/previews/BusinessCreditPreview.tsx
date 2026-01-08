import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, TrendingUp, Star, AlertCircle, ArrowUpRight } from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const tiers = [
  { 
    tier: 0, 
    name: "Business Readiness", 
    status: "complete" as const,
    progress: 100,
  },
  { 
    tier: 1, 
    name: "Net-30 Vendors", 
    status: "active" as const,
    progress: 60,
    vendors: ["Uline", "Quill", "Grainger"],
  },
  { 
    tier: 2, 
    name: "Store Credit", 
    status: "locked" as const,
    progress: 0,
  },
  { 
    tier: 3, 
    name: "Revolving Credit", 
    status: "locked" as const,
    progress: 0,
  },
];

const tradelines = [
  { vendor: "Uline", limit: "$1,000", status: "Active", reporting: true },
  { vendor: "Quill", limit: "$750", status: "Active", reporting: true },
  { vendor: "Grainger", limit: "Pending", status: "Applied", reporting: false },
];

const expandedTradelines = [
  { vendor: "Uline", limit: "$1,000", status: "Active", reporting: true, bureau: "D&B", opened: "Nov 2024" },
  { vendor: "Quill", limit: "$750", status: "Active", reporting: true, bureau: "D&B, Experian", opened: "Oct 2024" },
  { vendor: "Grainger", limit: "Pending", status: "Applied", reporting: false, bureau: "D&B", opened: "-" },
  { vendor: "Summa Office", limit: "$500", status: "Approved", reporting: false, bureau: "D&B", opened: "Dec 2024" },
];

const creditScores = [
  { bureau: "Dun & Bradstreet", score: "72", label: "PAYDEX", change: "+5" },
  { bureau: "Experian", score: "48", label: "Intelliscore", change: "+12" },
  { bureau: "Equifax", score: "--", label: "Credit Risk", change: null },
];

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-lg">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Business Credit Builder</h3>
            <p className="text-xs text-muted-foreground">Tier 1 in progress</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Building</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-5">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-3 rounded-xl text-center ${
                tier.status === "complete" 
                  ? "bg-primary/10 border border-primary/30" 
                  : tier.status === "active"
                    ? "bg-card border-2 border-primary"
                    : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className={`text-lg font-bold mb-0.5 ${
                tier.status === "complete" || tier.status === "active" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}>
                {tier.status === "locked" ? (
                  <Lock className="h-4 w-4 mx-auto" />
                ) : (
                  `T${tier.tier}`
                )}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{tier.name}</p>
              {tier.status === "active" && (
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tier.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
              {tier.status === "complete" && (
                <CheckCircle2 className="absolute top-2 right-2 h-3 w-3 text-primary" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h4 className="text-xs font-semibold text-foreground">Active Tradelines</h4>
          </div>
          <div className="divide-y divide-border">
            {tradelines.map((line, index) => (
              <motion.div
                key={line.vendor}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {line.vendor[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{line.vendor}</p>
                    <p className="text-[10px] text-muted-foreground">{line.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">{line.limit}</p>
                  {line.reporting && (
                    <p className="text-[10px] text-primary">Reporting ✓</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ExpandedContent() {
  return (
    <div className="space-y-6">
      {/* Credit Scores Overview */}
      <div className="grid grid-cols-3 gap-4">
        {creditScores.map((score, index) => (
          <motion.div
            key={score.bureau}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border text-center"
          >
            <p className="text-xs text-muted-foreground mb-2">{score.bureau}</p>
            <p className="text-3xl font-bold text-foreground">{score.score}</p>
            <p className="text-xs text-muted-foreground">{score.label}</p>
            {score.change && (
              <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-semibold">{score.change}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tier Progress */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-display font-bold text-lg text-foreground mb-4">Credit Building Tiers</h4>
        <div className="grid grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl text-center ${
                tier.status === "complete" 
                  ? "bg-primary/10 border-2 border-primary" 
                  : tier.status === "active"
                    ? "bg-card border-2 border-primary shadow-lg"
                    : "bg-muted/30 border border-border opacity-70"
              }`}
            >
              <div className={`text-2xl font-bold mb-1 ${
                tier.status === "complete" || tier.status === "active" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}>
                {tier.status === "locked" ? (
                  <Lock className="h-6 w-6 mx-auto" />
                ) : (
                  `Tier ${tier.tier}`
                )}
              </div>
              <p className="text-sm text-muted-foreground">{tier.name}</p>
              {tier.status === "active" && (
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-xs text-primary mt-1">{tier.progress}% complete</p>
                </div>
              )}
              {tier.status === "complete" && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Tradeline Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Tradeline Tracker</h4>
          <span className="text-xs text-muted-foreground">{expandedTradelines.length} accounts</span>
        </div>
        <div className="divide-y divide-border">
          {expandedTradelines.map((line, index) => (
            <motion.div
              key={line.vendor}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {line.vendor[0]}
                </div>
                <div>
                  <p className="font-medium text-foreground">{line.vendor}</p>
                  <p className="text-xs text-muted-foreground">Opened {line.opened}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Limit</p>
                  <p className="font-semibold text-foreground">{line.limit}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Bureau</p>
                  <p className="text-sm text-foreground">{line.bureau}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    line.status === "Active" 
                      ? "bg-primary/10 text-primary" 
                      : line.status === "Approved"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {line.reporting && <Star className="h-3 w-3" />}
                    {line.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground text-sm">Pro Tip</p>
          <p className="text-sm text-muted-foreground">
            Apply to 2-3 Net-30 vendors per month to steadily build your credit profile without appearing too aggressive.
          </p>
        </div>
      </div>
    </div>
  );
}

export const BusinessCreditPreview = memo(function BusinessCreditPreview() {
  return (
    <PreviewWrapper title="Business Credit Builder" expandedContent={<ExpandedContent />}>
      <PreviewContent />
    </PreviewWrapper>
  );
});
