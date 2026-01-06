import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { tierMeetsRequirement } from "@/lib/subscription-tiers";
import {
  Building2,
  CreditCard,
  User,
  CheckCircle2,
  Lock,
  ChevronRight,
  FileText,
  Phone,
  Mail,
  Building,
  Hash,
  Store,
  Clock,
  Wallet,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

// Complete 8-step credit building journey
const CREDIT_BUILDING_STEPS = [
  {
    step: 1,
    id: "form_llc",
    title: "Form Your LLC Properly",
    description: "Register your business entity with the state",
    icon: FileText,
    module: "business_starter",
  },
  {
    step: 2,
    id: "get_ein",
    title: "Get Your EIN (FREE)",
    description: "Apply for your Employer Identification Number",
    icon: Hash,
    module: "business_starter",
  },
  {
    step: 3,
    id: "business_profile",
    title: "Set Up Your Business Profile",
    description: "Bank account, phone, email, and address",
    icon: Building,
    module: "business_starter",
  },
  {
    step: 4,
    id: "duns_number",
    title: "Get Your DUNS Number (FREE)",
    description: "Register with Dun & Bradstreet",
    icon: Building2,
    module: "business_credit",
  },
  {
    step: 5,
    id: "tier_1_vendors",
    title: "Open Tier-1 Net-30 Vendor Accounts",
    description: "Start with easy-approval vendors that report to bureaus",
    icon: Store,
    module: "business_credit",
  },
  {
    step: 6,
    id: "wait_reporting",
    title: "Wait 30-45 Days for Reporting",
    description: "Allow time for payment history to report",
    icon: Clock,
    module: "business_credit",
  },
  {
    step: 7,
    id: "tier_2_store",
    title: "Move to Tier-2 Store Credit",
    description: "Apply for store credit cards (Staples, Amazon, etc.)",
    icon: Wallet,
    module: "business_credit",
  },
  {
    step: 8,
    id: "tier_3_revolving",
    title: "Tier-3 Revolving Credit",
    description: "Apply for business credit cards and lines of credit",
    icon: CreditCard,
    module: "business_credit",
  },
];

const MODULES = [
  {
    id: "business_starter",
    title: "Start Your Business",
    description: "Form LLC, get EIN, set up bank account, phone & email",
    icon: Building2,
    href: "/app/business-starter",
    requiredTier: "free" as const,
    color: "primary",
  },
  {
    id: "business_credit",
    title: "Build Business Credit",
    description: "Progress through credit tiers with strategic vendor accounts",
    icon: CreditCard,
    href: "/app/business-credit",
    requiredTier: "start" as const,
    color: "accent-gold",
  },
  {
    id: "personal_brand",
    title: "Build Your Brand",
    description: "Create your Digital CV and professional presence",
    icon: User,
    href: "/app/personal-brand",
    requiredTier: "start" as const,
    color: "secondary",
  },
];

export default function FullProductSuite() {
  const { subscription } = useAuth();
  const { progress, getModuleProgress, isLoading } = useProgress();
  const userTier = subscription?.tier || "free";

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
          <div key={i} className="h-48 bg-muted/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Journey Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-card to-accent-gold/5 border border-border rounded-2xl p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Your Credit Building Journey
            </h2>
            <p className="text-muted-foreground">
              Complete all 8 steps to build a strong business credit profile
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-primary">
                {journeyProgress.percentage}%
              </p>
              <p className="text-sm text-muted-foreground">
                {journeyProgress.completed}/{journeyProgress.total} steps
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * journeyProgress.percentage) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 8-Step Timeline */}
        <div className="relative">
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-border" />
          
          <div className="space-y-3">
            {CREDIT_BUILDING_STEPS.map((step, index) => {
              const hasAccess = tierMeetsRequirement(userTier, step.module === "business_starter" ? "free" : "start");
              const key = `${step.module}-${step.id}`;
              const isCompleted = progress[key]?.completed;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative flex items-start gap-4 pl-10 py-3 rounded-xl transition-all ${
                    isCompleted 
                      ? "bg-primary/5" 
                      : hasAccess 
                        ? "hover:bg-muted/50 cursor-pointer" 
                        : "opacity-60"
                  }`}
                >
                  {/* Step indicator */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background ${
                    isCompleted 
                      ? "border-primary bg-primary text-primary-foreground"
                      : hasAccess
                        ? "border-border text-muted-foreground"
                        : "border-muted text-muted-foreground/50"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : hasAccess ? (
                      <span className="text-xs font-bold">{step.step}</span>
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </div>

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? "bg-primary/10 text-primary" 
                      : hasAccess
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted/50 text-muted-foreground/50"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${isCompleted ? "text-foreground" : hasAccess ? "text-foreground" : "text-muted-foreground"}`}>
                        Step {step.step}: {step.title}
                      </h4>
                      {isCompleted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                  </div>

                  {hasAccess && !isCompleted && (
                    <Link 
                      to={step.module === "business_starter" ? "/app/business-starter" : "/app/business-credit"}
                      className="flex-shrink-0"
                    >
                      <Button variant="outline" size="sm">
                        Start <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {MODULES.map((module, index) => {
          const hasAccess = tierMeetsRequirement(userTier, module.requiredTier);
          const moduleProgress = getModuleProgress(module.id);
          const Icon = module.icon;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={hasAccess ? module.href : "/pricing"}
                className={`block h-full rounded-2xl border transition-all ${
                  hasAccess
                    ? "bg-card border-border hover:border-primary/30 hover:shadow-lg"
                    : "bg-muted/30 border-border"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      hasAccess ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {hasAccess ? (
                        <Icon className="h-6 w-6 text-primary" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    {hasAccess && moduleProgress.completed > 0 && (
                      <span className="text-sm font-bold text-primary">
                        {moduleProgress.percentage}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {module.description}
                  </p>

                  {hasAccess && (
                    <>
                      <Progress value={moduleProgress.percentage} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {moduleProgress.completed}/{moduleProgress.total} steps completed
                      </p>
                    </>
                  )}

                  {!hasAccess && (
                    <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block">
                      Upgrade Required
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/app/analytics">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Link to="/app/business-credit">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Credit Tracker
            </Button>
          </Link>
          <Link to="/app/personal-brand">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Personal Brand
            </Button>
          </Link>
          <Link to="/app/resources">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Resources
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
