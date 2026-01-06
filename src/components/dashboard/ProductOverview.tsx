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
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
} from "lucide-react";

const MODULES = [
  {
    id: "business_starter",
    title: "Start Your Business",
    description: "Form LLC, get EIN, set up bank account, phone & email",
    icon: Building2,
    href: "/app/business-starter",
    requiredTier: "free" as const,
    steps: [
      "Form your LLC",
      "Get your EIN",
      "Open business bank account",
      "Get business phone",
      "Set up professional email",
    ],
  },
  {
    id: "business_credit",
    title: "Build Business Credit",
    description: "Progress through credit tiers with strategic vendor accounts",
    icon: CreditCard,
    href: "/app/business-credit",
    requiredTier: "start" as const,
    steps: [
      "Get D-U-N-S number",
      "Establish business address",
      "Get dedicated phone",
      "Open Net-30 accounts",
      "Get store credit cards",
      "Apply for business credit cards",
      "Monitor & maintain",
    ],
  },
  {
    id: "personal_brand",
    title: "Build Your Brand",
    description: "Create your Digital CV and professional presence",
    icon: User,
    href: "/app/personal-brand",
    requiredTier: "start" as const,
    steps: [
      "Set up profile",
      "Add bio & headline",
      "Add skills",
      "Add projects",
      "Configure SEO",
      "Publish",
    ],
  },
];

export default function ProductOverview() {
  const { subscription } = useAuth();
  const { getModuleProgress, isLoading } = useProgress();
  const userTier = subscription?.tier || "free";

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
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Your Journey</h2>
        <p className="text-sm text-muted-foreground">
          Complete each module step-by-step to build your business foundation
        </p>
      </div>

      <div className="space-y-4">
        {MODULES.map((module, index) => {
          const hasAccess = tierMeetsRequirement(userTier, module.requiredTier);
          const progress = getModuleProgress(module.id);
          const Icon = module.icon;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={hasAccess ? module.href : "/pricing"}
                className={`block rounded-xl border transition-all ${
                  hasAccess
                    ? "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                    : "bg-muted/30 border-border"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      hasAccess ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {hasAccess ? (
                        <Icon className="h-6 w-6 text-primary" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                        {hasAccess && progress.completed > 0 && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {progress.percentage}%
                          </span>
                        )}
                        {!hasAccess && (
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            Upgrade Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      
                      {hasAccess && (
                        <>
                          <Progress value={progress.percentage} className="h-2 mb-3" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {progress.completed} of {progress.total} steps completed
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step Preview */}
                {hasAccess && (
                  <div className="border-t border-border px-5 py-3 bg-muted/20">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {module.steps.slice(0, 4).map((step, stepIndex) => {
                        const isCompleted = stepIndex < progress.completed;
                        return (
                          <div
                            key={step}
                            className={`flex items-center gap-2 text-xs whitespace-nowrap ${
                              isCompleted ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border-2 border-current flex-shrink-0" />
                            )}
                            {step}
                          </div>
                        );
                      })}
                      {module.steps.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{module.steps.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
