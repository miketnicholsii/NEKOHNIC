import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { useTasks } from "@/hooks/use-tasks";
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardStats() {
  const { progress, getAllModulesProgress } = useProgress();
  const { tasks } = useTasks();

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
      label: "Overall Progress",
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Steps Completed",
      value: completedSteps.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Active Tasks",
      value: inProgressTasks.toString(),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Tasks Done",
      value: completedTasks.toString(),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
