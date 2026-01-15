import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { tierMeetsRequirement, normalizeTier } from "@/lib/subscription-tiers";
import {
  Building2,
  CreditCard,
  User,
  CheckCircle2,
  Lock,
  ChevronRight,
  FileText,
  Hash,
  Building,
  Store,
  Clock,
  Wallet,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

// Complete 8-step credit building journey
const CREDIT_BUILDING_STEPS = [
  { step: 1, id: "form_llc", title: "Form Your LLC", description: "Register your business entity", icon: FileText, module: "business_starter" },
  { step: 2, id: "get_ein", title: "Get Your EIN", description: "Apply for your Employer ID Number", icon: Hash, module: "business_starter" },
  { step: 3, id: "business_profile", title: "Business Profile", description: "Bank, phone, email & address", icon: Building, module: "business_starter" },
  { step: 4, id: "duns_number", title: "DUNS Number", description: "Register with Dun & Bradstreet", icon: Building2, module: "business_credit" },
  { step: 5, id: "tier_1_vendors", title: "Tier-1 Net-30 Vendors", description: "Easy-approval vendors that report", icon: Store, module: "business_credit" },
  { step: 6, id: "wait_reporting", title: "Wait for Reporting", description: "30-45 days for payment history", icon: Clock, module: "business_credit" },
  { step: 7, id: "tier_2_store", title: "Tier-2 Store Credit", description: "Staples, Amazon, etc.", icon: Wallet, module: "business_credit" },
  { step: 8, id: "tier_3_revolving", title: "Tier-3 Credit Cards", description: "Business credit cards & lines", icon: CreditCard, module: "business_credit" },
];

const MODULES = [
  { id: "business_starter", title: "Start Your Business", description: "LLC, EIN, bank account setup", icon: Building2, href: "/app/business-starter", requiredTier: "free" },
  { id: "business_credit", title: "Build Credit", description: "Strategic vendor accounts", icon: CreditCard, href: "/app/business-credit", requiredTier: "starter" },
  { id: "personal_brand", title: "Build Your Brand", description: "Digital CV & presence", icon: User, href: "/app/personal-brand", requiredTier: "starter" },
];

export default function FullProductSuite() {
  const { subscription } = useAuth();
  const { progress, getModuleProgress, isLoading } = useProgress();
  const userTier = normalizeTier(subscription?.tier);

  // Calculate overall journey progress
  const calculateJourneyProgress = () => {
    let completed = 0;
    CREDIT_BUILDING_STEPS.forEach(step => {
      const key = `${step.module}-${step.id}`;
      if (progress[key]?.completed) completed++;
    });
    return {
      completed,
      total: CREDIT_BUILDING_STEPS.length,
      percentage: Math.round((completed / CREDIT_BUILDING_STEPS.length) * 100),
    };
  };

  const journeyProgress = calculateJourneyProgress();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Journey Progress - Cleaner design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Credit Building Journey
              </h2>
              <p className="text-xs text-muted-foreground">
                {journeyProgress.completed} of {journeyProgress.total} steps complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{journeyProgress.percentage}%</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <motion.circle
                  cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={176}
                  initial={{ strokeDashoffset: 176 }}
                  animate={{ strokeDashoffset: 176 - (176 * journeyProgress.percentage) / 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Steps - Compact timeline */}
        <div className="px-5 py-4 max-h-[400px] overflow-y-auto">
          <div className="relative">
            <div className="absolute left-3 top-4 bottom-4 w-px bg-border" />
            
            <div className="space-y-2">
              {CREDIT_BUILDING_STEPS.map((step, index) => {
                const hasAccess = tierMeetsRequirement(userTier, step.module === "business_starter" ? "free" : "start");
                const key = `${step.module}-${step.id}`;
                const isCompleted = progress[key]?.completed;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`relative flex items-center gap-3 pl-8 py-2.5 rounded-lg transition-all ${
                      isCompleted ? "bg-primary/5" : hasAccess ? "hover:bg-muted/50" : "opacity-50"
                    }`}
                  >
                    {/* Step indicator */}
                    <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted 
                        ? "bg-primary text-primary-foreground"
                        : hasAccess
                          ? "bg-background border-2 border-border text-muted-foreground"
                          : "bg-muted text-muted-foreground/50"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : hasAccess ? step.step : <Lock className="h-3 w-3" />}
                    </div>

                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? "bg-primary/10 text-primary" : hasAccess ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground/50"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isCompleted || hasAccess ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{step.description}</p>
                    </div>

                    {isCompleted && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Done</span>
                    )}
                    {hasAccess && !isCompleted && (
                      <Link to={step.module === "business_starter" ? "/app/business-starter" : "/app/business-credit"}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Start <ChevronRight className="h-3 w-3 ml-0.5" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Module Cards - Compact grid */}
      <div className="grid md:grid-cols-3 gap-3">
        {MODULES.map((module, index) => {
          const hasAccess = tierMeetsRequirement(userTier, module.requiredTier);
          const moduleProgress = getModuleProgress(module.id);
          const Icon = module.icon;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                to={hasAccess ? module.href : "/pricing"}
                className={`block h-full rounded-xl border p-4 transition-all ${
                  hasAccess ? "bg-card border-border hover:border-primary/20 hover:shadow-md" : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    hasAccess ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {hasAccess ? <Icon className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  {hasAccess && moduleProgress.completed > 0 && (
                    <span className="text-sm font-bold text-primary">{moduleProgress.percentage}%</span>
                  )}
                </div>

                <h3 className="font-semibold text-foreground text-sm mb-0.5">{module.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{module.description}</p>

                {hasAccess && (
                  <>
                    <Progress value={moduleProgress.percentage} className="h-1.5 mb-1.5" />
                    <p className="text-[10px] text-muted-foreground">
                      {moduleProgress.completed}/{moduleProgress.total} steps
                    </p>
                  </>
                )}
                {!hasAccess && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Upgrade Required
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-4"
      >
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Link to="/app/analytics">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link to="/app/business-credit">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
              <CreditCard className="h-3.5 w-3.5 mr-2" />
              Credit Tracker
            </Button>
          </Link>
          <Link to="/app/personal-brand">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
              <User className="h-3.5 w-3.5 mr-2" />
              Personal Brand
            </Button>
          </Link>
          <Link to="/app/resources">
            <Button variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
              <FileText className="h-3.5 w-3.5 mr-2" />
              Resources
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}