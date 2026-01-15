import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { useTasks } from "@/hooks/use-tasks";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StatsGridSkeleton } from "./DashboardSkeletons";
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardStats() {
  const { progress, getAllModulesProgress, isLoading: progressLoading } = useProgress();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const prefersReducedMotion = useReducedMotion();

  const isLoading = progressLoading || tasksLoading;

  // Show skeleton while loading
  if (isLoading) {
    return <StatsGridSkeleton />;
  }

  // Calculate stats from progress Record
  const progressItems = Object.values(progress);
  const completedSteps = progressItems.filter(p => p.completed).length;
  
  // Get all modules progress for overall calculation
  const modulesProgress = getAllModulesProgress();
  const totalModuleSteps = modulesProgress.reduce((sum, m) => sum + m.total, 0);
  const overallProgress = totalModuleSteps > 0 
    ? Math.round((completedSteps / totalModuleSteps) * 100) 
    : 0;
  
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "done").length;

  const stats = [
    {
      label: "Progress",
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Steps Done",
      value: completedSteps.toString(),
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "In Progress",
      value: inProgressTasks.toString(),
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Completed",
      value: completedTasks.toString(),
      icon: Target,
      color: "text-accent-foreground",
      bgColor: "bg-accent/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="region" aria-label="Dashboard statistics">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}