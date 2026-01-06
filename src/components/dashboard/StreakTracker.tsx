import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStreaks } from "@/hooks/use-streaks";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Award,
  ChevronRight,
  AlertCircle
} from "lucide-react";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

function getNextMilestone(current: number): number {
  for (const milestone of STREAK_MILESTONES) {
    if (current < milestone) return milestone;
  }
  return Math.ceil((current + 1) / 30) * 30; // Next 30-day interval
}

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return "👑";
  if (streak >= 60) return "💎";
  if (streak >= 30) return "🏆";
  if (streak >= 14) return "⭐";
  if (streak >= 7) return "🔥";
  if (streak >= 3) return "✨";
  return "🌱";
}

export default function StreakTracker() {
  const { streaks, isLoading, streakStatus } = useStreaks();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="h-32 bg-muted/50 animate-pulse rounded-lg" />
      </div>
    );
  }

  const loginMilestone = getNextMilestone(streaks.login_streak_current);
  const taskMilestone = getNextMilestone(streaks.task_streak_current);
  const loginProgress = (streaks.login_streak_current / loginMilestone) * 100;
  const taskProgress = (streaks.task_streak_current / taskMilestone) * 100;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Streaks</h3>
              <p className="text-xs text-muted-foreground">
                Stay consistent, build momentum
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Login Streak */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getStreakEmoji(streaks.login_streak_current)}</span>
              <div>
                <p className="text-sm font-medium text-foreground">Daily Login</p>
                <p className="text-xs text-muted-foreground">
                  Best: {streaks.login_streak_longest} days
                </p>
              </div>
            </div>
            <div className="text-right">
              <motion.p 
                key={streaks.login_streak_current}
                initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-2xl font-display font-bold"
              >
                {streaks.login_streak_current}
              </motion.p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">days</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Next milestone</span>
              <span className="font-medium text-primary">
                {streaks.login_streak_current}/{loginMilestone}
              </span>
            </div>
            <Progress value={loginProgress} className="h-2" />
          </div>

          {streakStatus.loginAtRisk && streaks.login_streak_current > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-xs text-destructive">Streak at risk! Log in daily to maintain.</p>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Task Streak */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getStreakEmoji(streaks.task_streak_current)}</span>
              <div>
                <p className="text-sm font-medium text-foreground">Task Completion</p>
                <p className="text-xs text-muted-foreground">
                  Best: {streaks.task_streak_longest} days
                </p>
              </div>
            </div>
            <div className="text-right">
              <motion.p 
                key={streaks.task_streak_current}
                initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-2xl font-display font-bold"
              >
                {streaks.task_streak_current}
              </motion.p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">days</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Next milestone</span>
              <span className="font-medium text-accent-gold">
                {streaks.task_streak_current}/{taskMilestone}
              </span>
            </div>
            <Progress value={taskProgress} className="h-2 [&>div]:bg-accent-gold" />
          </div>

          {streakStatus.taskAtRisk && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-accent-gold/10 border border-accent-gold/20"
            >
              <Zap className="h-4 w-4 text-accent-gold" />
              <p className="text-xs text-accent-gold-foreground">Complete a task today to keep your streak!</p>
            </motion.div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-display font-bold text-foreground">{streaks.total_login_days}</p>
            <p className="text-[10px] text-muted-foreground">Total Days</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-display font-bold text-foreground">{streaks.total_tasks_completed}</p>
            <p className="text-[10px] text-muted-foreground">Tasks Done</p>
          </div>
        </div>
      </div>
    </div>
  );
}
