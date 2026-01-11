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
    return null; // All complete
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
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Your recommended actions based on your progress
        </p>
      </div>

      {/* Primary Next Action */}
      {primaryNextStep && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-primary-foreground/80 mb-1">
                {MODULE_INFO[primaryNextStep.module]?.name}
              </p>
              <h3 className="font-display text-lg font-semibold">
                {primaryNextStep.title}
              </h3>
            </div>
            <Link to={primaryNextStep.href}>
              <Button variant="hero" className="group">
                Continue
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Upcoming Steps */}
      {sortedSteps.length > 1 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm">Coming Up</h3>
          {sortedSteps.slice(1, 4).map((step, index) => {
            if (!step) return null;
            const info = MODULE_INFO[step.module];
            const Icon = info?.icon || Circle;
            
            return (
              <motion.div
                key={`${step.module}-${step.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={step.href}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{info?.name}</p>
                    <p className="text-sm font-medium text-foreground truncate">{step.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-destructive" aria-hidden="true" />
            Priority Tasks
          </h3>
          {urgentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                task.priority === "urgent" 
                  ? "bg-destructive/5 border-destructive/30" 
                  : "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30"
              }`}
            >
              <Circle className={`h-4 w-4 flex-shrink-0 ${
                task.priority === "urgent" ? "text-destructive" : "text-orange-600"
              }`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                {task.due_date && (
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.priority === "urgent" 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
              }`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* All Complete State */}
      {sortedSteps.length === 0 && urgentTasks.length === 0 && (
        <div className="text-center py-8" role="status">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-semibold text-foreground mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">
            You've completed all available steps. Great work!
          </p>
        </div>
      )}
    </div>
  );
}
