import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { useTasks } from "@/hooks/use-tasks";
import { useAchievements } from "@/hooks/use-achievements";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "progress" | "task" | "achievement";
  title: string;
  description: string;
  timestamp: Date;
  icon: typeof CheckCircle2;
  color: string;
}

export default function ActivityFeed() {
  const { progress } = useProgress();
  const { tasks } = useTasks();
  const { earnedAchievements } = useAchievements();

  // Build activity feed from recent data
  const activities: ActivityItem[] = [];

  // Add recent completed progress
  Object.entries(progress)
    .filter(([_, p]) => p.completed && p.completed_at)
    .slice(0, 3)
    .forEach(([key, p]) => {
      activities.push({
        id: `progress-${key}`,
        type: "progress",
        title: "Step completed",
        description: `Completed ${p.step} in ${p.module}`,
        timestamp: new Date(p.completed_at!),
        icon: CheckCircle2,
        color: "text-primary",
      });
    });

  // Add recent completed tasks
  tasks
    .filter(t => t.status === "done")
    .slice(0, 3)
    .forEach(t => {
      activities.push({
        id: `task-${t.id}`,
        type: "task",
        title: "Task completed",
        description: t.title,
        timestamp: new Date(t.updated_at),
        icon: Target,
        color: "text-accent-foreground",
      });
    });

  // Add recent achievements
  earnedAchievements
    .slice(0, 2)
    .forEach(a => {
      const achievementDef = ACHIEVEMENTS.find(ach => ach.id === a.achievement_id);
      activities.push({
        id: `achievement-${a.id}`,
        type: "achievement",
        title: "Achievement unlocked",
        description: achievementDef?.name || a.achievement_id,
        timestamp: new Date(a.earned_at),
        icon: Trophy,
        color: "text-secondary",
      });
    });

  // Sort by timestamp descending and take top 5
  const sortedActivities = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  if (sortedActivities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
        role="region"
        aria-label="Recent activity"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Activity className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Your latest updates</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm text-center py-8">
          No recent activity. Start completing tasks to see your progress here!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
      role="region"
      aria-label="Recent activity"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
          <Activity className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your latest updates</p>
        </div>
      </div>

      <ul className="space-y-3" role="list" aria-label="Activity items">
        {sortedActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${activity.color}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <time 
                dateTime={activity.timestamp.toISOString()}
                className="text-xs text-muted-foreground flex-shrink-0"
              >
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </time>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}