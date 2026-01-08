import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, TrendingUp, Star, AlertCircle, ArrowUpRight, CreditCard, Shield, Award } from "lucide-react";
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
  { vendor: "Uline", limit: "$1,000", status: "Active", reporting: true, color: "from-primary/20 to-primary/5" },
  { vendor: "Quill", limit: "$750", status: "Active", reporting: true, color: "from-secondary/20 to-secondary/5" },
  { vendor: "Grainger", limit: "Pending", status: "Applied", reporting: false, color: "from-muted to-muted/50" },
];

const expandedTradelines = [
  { vendor: "Uline", limit: "$1,000", status: "Active", reporting: true, bureau: "D&B", opened: "Nov 2024", color: "from-primary/20 to-primary/5" },
  { vendor: "Quill", limit: "$750", status: "Active", reporting: true, bureau: "D&B, Experian", opened: "Oct 2024", color: "from-secondary/20 to-secondary/5" },
  { vendor: "Grainger", limit: "Pending", status: "Applied", reporting: false, bureau: "D&B", opened: "-", color: "from-muted to-muted/50" },
  { vendor: "Summa Office", limit: "$500", status: "Approved", reporting: false, bureau: "D&B", opened: "Dec 2024", color: "from-accent/20 to-accent/5" },
];

const creditScores = [
  { bureau: "Dun & Bradstreet", score: "72", label: "PAYDEX", change: "+5", icon: Shield, color: "text-primary" },
  { bureau: "Experian Business", score: "48", label: "Intelliscore", change: "+12", icon: Award, color: "text-secondary" },
  { bureau: "Equifax", score: "--", label: "Credit Risk", change: null, icon: CreditCard, color: "text-muted-foreground" },
];

const staggerItem = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
            >
              <CreditCard className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Business Credit Builder</h3>
              <p className="text-xs text-muted-foreground">Tier 1 in progress</p>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
          >
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Building</span>
          </motion.div>
        </motion.div>

        {/* Tier Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-2 mb-5"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.tier}
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`relative p-3 rounded-xl text-center transition-all ${
                tier.status === "complete" 
                  ? "bg-primary/10 border-2 border-primary/40" 
                  : tier.status === "active"
                    ? "bg-card border-2 border-primary shadow-lg shadow-primary/10"
                    : "bg-muted/30 border border-border opacity-50"
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
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${tier.progress}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  />
                </div>
              )}
              {tier.status === "complete" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <CheckCircle2 className="absolute top-2 right-2 h-3.5 w-3.5 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Tradelines Table */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">Active Tradelines</h4>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{tradelines.length} accounts</span>
          </div>
          <div className="divide-y divide-border">
            {tradelines.map((line, index) => (
              <motion.div
                key={line.vendor}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                className="flex items-center justify-between px-4 py-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${line.color} flex items-center justify-center text-xs font-bold text-foreground`}>
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
                    <p className="text-[10px] text-primary flex items-center gap-1 justify-end">
                      <Star className="h-2.5 w-2.5 fill-current" /> Reporting
                    </p>
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
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4"
      >
        {creditScores.map((score, index) => (
          <motion.div
            key={score.bureau}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-5 rounded-2xl bg-card border border-border text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-3">
                <score.icon className={`h-4 w-4 ${score.color}`} />
                <p className="text-xs text-muted-foreground">{score.bureau}</p>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{score.score}</p>
              <p className="text-xs text-muted-foreground">{score.label}</p>
              {score.change && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-center gap-1 mt-3 text-primary"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">{score.change}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tier Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="h-5 w-5 text-primary" />
          <h4 className="font-display font-bold text-lg text-foreground">Credit Building Tiers</h4>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`relative p-5 rounded-xl text-center transition-all cursor-pointer ${
                tier.status === "complete" 
                  ? "bg-primary/10 border-2 border-primary" 
                  : tier.status === "active"
                    ? "bg-card border-2 border-primary shadow-xl shadow-primary/15"
                    : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className={`text-2xl font-bold mb-1.5 ${
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
                <div className="mt-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-primary mt-2 font-medium">{tier.progress}% complete</p>
                </div>
              )}
              {tier.status === "complete" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Full Tradeline Table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Tradeline Tracker</h4>
          <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">{expandedTradelines.length} accounts</span>
        </div>
        <div className="divide-y divide-border">
          {expandedTradelines.map((line, index) => (
            <motion.div
              key={line.vendor}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.06 }}
              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
              className="flex items-center justify-between px-6 py-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${line.color} flex items-center justify-center text-sm font-bold text-foreground`}>
                  {line.vendor[0]}
                </div>
                <div>
                  <p className="font-medium text-foreground">{line.vendor}</p>
                  <p className="text-xs text-muted-foreground">Opened {line.opened}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
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
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    line.status === "Active" 
                      ? "bg-primary/10 text-primary" 
                      : line.status === "Approved"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {line.reporting && <Star className="h-3 w-3 fill-current" />}
                    {line.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pro Tip */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Pro Tip</p>
          <p className="text-sm text-muted-foreground mt-1">
            Apply to 2-3 Net-30 vendors per month to steadily build your credit profile without appearing too aggressive. Pay early and in full for maximum impact.
          </p>
        </div>
      </motion.div>
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
