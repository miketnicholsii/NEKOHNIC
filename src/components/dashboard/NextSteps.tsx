import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { useTasks } from "@/hooks/use-tasks";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { NextStepsSkeleton } from "./DashboardSkeletons";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Building2,
  CreditCard,
  User,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Steps for each module in order
const MODULE_STEPS: Record<string, { id: string; title: string; href: string }[]> = {
  business_starter: [
    { id: "registered_business", title: "Form your LLC", href: "/app/business-starter" },
    { id: "ein_number", title: "Get your EIN", href: "/app/business-starter" },
    { id: "business_bank", title: "Open business bank account", href: "/app/business-starter" },
    { id: "business_phone", title: "Get business phone", href: "/app/business-starter" },
    { id: "professional_email", title: "Set up professional email", href: "/app/business-starter" },
  ],
  business_credit: [
    { id: "duns_number", title: "Get D-U-N-S number", href: "/app/business-credit" },
    { id: "business_address", title: "Establish business address", href: "/app/business-credit" },
    { id: "business_phone", title: "Get dedicated phone", href: "/app/business-credit" },
    { id: "net30_vendors", title: "Open Net-30 accounts", href: "/app/business-credit" },
    { id: "store_credit", title: "Get store credit cards", href: "/app/business-credit" },
    { id: "business_credit_card", title: "Apply for business credit cards", href: "/app/business-credit" },
    { id: "credit_monitoring", title: "Monitor & maintain scores", href: "/app/business-credit" },
  ],
  personal_brand: [
    { id: "profile_setup", title: "Set up your profile", href: "/app/personal-brand" },
    { id: "bio_headline", title: "Add bio & headline", href: "/app/personal-brand" },
    { id: "skills", title: "Add your skills", href: "/app/personal-brand" },
    { id: "projects", title: "Add your projects", href: "/app/personal-brand" },
    { id: "seo", title: "Configure SEO settings", href: "/app/personal-brand" },
    { id: "publish", title: "Publish your CV", href: "/app/personal-brand" },
  ],
};

const MODULE_INFO: Record<string, { name: string; icon: React.ElementType }> = {
  business_starter: { name: "Business Starter", icon: Building2 },
  business_credit: { name: "Business Credit", icon: CreditCard },
  personal_brand: { name: "Personal Brand", icon: User },
};

export default function NextSteps() {
  const { progress, isLoading: progressLoading } = useProgress();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const prefersReducedMotion = useReducedMotion();

  const isLoading = progressLoading || tasksLoading;

  // Show skeleton while loading
  if (isLoading) {
    return <NextStepsSkeleton />;
  }

  // Find next incomplete step for each module
  const getNextStep = (module: string) => {
    const steps = MODULE_STEPS[module];
    if (!steps) return null;

    for (const step of steps) {
      const key = `${module}:${step.id}`;
      if (!progress[key]?.completed) {
        return step;
      }
    }
    return null;
  };

  // Get urgent/high priority incomplete tasks
  const urgentTasks = tasks
    .filter(t => t.status !== "done" && (t.priority === "urgent" || t.priority === "high"))
    .slice(0, 3);

  // Get next steps from all modules
  const allNextSteps = Object.keys(MODULE_STEPS)
    .map(module => {
      const step = getNextStep(module);
      if (!step) return null;
      return { module, ...step };
    })
    .filter(Boolean);

  // Prioritize: business_starter first, then credit, then brand
  const moduleOrder = ["business_starter", "business_credit", "personal_brand"];
  const sortedSteps = allNextSteps.sort((a, b) => {
    if (!a || !b) return 0;
    return moduleOrder.indexOf(a.module) - moduleOrder.indexOf(b.module);
  });

  const primaryNextStep = sortedSteps[0];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-base font-semibold text-foreground mb-0.5">Next Steps</h2>
        <p className="text-xs text-muted-foreground">
          Recommended actions based on your progress
        </p>
      </div>

      {/* Primary Next Action - Compact */}
      {primaryNextStep && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-primary text-primary-foreground"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary-foreground/70">
                {MODULE_INFO[primaryNextStep.module]?.name}
              </p>
              <h3 className="font-semibold text-sm">
                {primaryNextStep.title}
              </h3>
            </div>
            <Link to={primaryNextStep.href}>
              <Button variant="secondary" size="sm" className="group h-8">
                Continue
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Upcoming Steps - Compact */}
      {sortedSteps.length > 1 && (
        <div className="space-y-2">
          <h3 className="font-medium text-foreground text-xs">Coming Up</h3>
          {sortedSteps.slice(1, 4).map((step, index) => {
            if (!step) return null;
            const info = MODULE_INFO[step.module];
            const Icon = info?.icon || Circle;
            
            return (
              <motion.div
                key={`${step.module}-${step.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={step.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground">{info?.name}</p>
                    <p className="text-xs font-medium text-foreground truncate">{step.title}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Urgent Tasks - Compact */}
      {urgentTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-foreground text-xs flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-destructive" />
            Priority Tasks
          </h3>
          {urgentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                task.priority === "urgent" 
                  ? "bg-destructive/5 border-destructive/20" 
                  : "bg-amber-500/5 border-amber-500/20"
              }`}
            >
              <Circle className={`h-3.5 w-3.5 flex-shrink-0 ${
                task.priority === "urgent" ? "text-destructive" : "text-amber-600"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                {task.due_date && (
                  <p className="text-[10px] text-muted-foreground">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                task.priority === "urgent" 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-amber-500/10 text-amber-600"
              }`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* All Complete State */}
      {sortedSteps.length === 0 && urgentTasks.length === 0 && (
        <div className="text-center py-6" role="status">
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground text-sm mb-0.5">All caught up!</h3>
          <p className="text-xs text-muted-foreground">
            You've completed all available steps.
          </p>
        </div>
      )}
    </div>
  );
}