import { memo } from "react";
import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  ListChecks, 
  Trophy, 
  Flame,
  ArrowRight,
  Building2,
  CreditCard,
  User,
  ChevronRight,
  Calendar,
  Bell,
  Target,
  Zap
} from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const stats = [
  { label: "Steps Completed", value: "12", change: "+3 this week" },
  { label: "Current Streak", value: "7", suffix: "days" },
  { label: "Credit Tier", value: "1", suffix: "of 3" },
];

const quickActions = [
  { icon: Building2, label: "Business Starter", progress: 40 },
  { icon: CreditCard, label: "Credit Builder", progress: 25 },
  { icon: User, label: "Personal Brand", progress: 60 },
];

const recentActivity = [
  { text: "Completed EIN application", time: "2 hours ago", type: "success" },
  { text: "Added Uline tradeline", time: "Yesterday", type: "info" },
  { text: "Published Digital CV", time: "3 days ago", type: "success" },
];

const expandedStats = [
  { label: "Steps Completed", value: "12", change: "+3 this week", icon: Target },
  { label: "Current Streak", value: "7", suffix: "days", icon: Flame },
  { label: "Credit Tier", value: "1", suffix: "of 3", icon: CreditCard },
  { label: "Achievements", value: "5", suffix: "earned", icon: Trophy },
];

const upcomingTasks = [
  { title: "Submit LLC paperwork", due: "Tomorrow", priority: "high" },
  { title: "Apply to Grainger", due: "In 3 days", priority: "medium" },
  { title: "Update Digital CV bio", due: "Next week", priority: "low" },
];

const achievements = [
  { name: "First Steps", description: "Complete your first task", earned: true },
  { name: "Week Warrior", description: "7-day login streak", earned: true },
  { name: "Credit Builder", description: "Add 3 tradelines", earned: false },
];

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-lg">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Good morning, Alex</h3>
            <p className="text-xs text-muted-foreground">Here's your progress overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
              <Flame className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">7 day streak</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-xl bg-card border border-border"
            >
              <p className="text-[10px] text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-xs text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
              {stat.change && (
                <p className="text-[10px] text-primary mt-1">{stat.change}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-foreground">Continue Building</h4>
              <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-2.5">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{action.label}</p>
                    <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${action.progress}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-foreground">Recent Activity</h4>
              <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-2.5 py-2 border-b border-border last:border-0"
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    item.type === "success" ? "bg-primary" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ExpandedContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Good morning, Alex</h2>
          <p className="text-muted-foreground">Let's keep building your business foundation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary">
            <Flame className="h-5 w-5" />
            <span className="font-semibold">7 day streak</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {expandedStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              {stat.suffix && (
                <span className="text-sm text-muted-foreground">{stat.suffix}</span>
              )}
            </div>
            {stat.change && (
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Continue Building</h4>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{action.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${action.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{action.progress}%</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Upcoming Tasks</h4>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === "high" ? "bg-destructive" : 
                    task.priority === "medium" ? "bg-secondary" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium text-foreground text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.due}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                  Start
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Recent Achievements</h4>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl text-center ${
                achievement.earned 
                  ? "bg-primary/10 border-2 border-primary" 
                  : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Trophy className="h-6 w-6" />
              </div>
              <p className="font-medium text-foreground text-sm">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Ready to continue?</p>
            <p className="text-sm text-muted-foreground">Pick up where you left off with your next task.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export const DashboardPreview = memo(function DashboardPreview() {
  return (
    <PreviewWrapper title="Your Dashboard" expandedContent={<ExpandedContent />}>
      <PreviewContent />
    </PreviewWrapper>
  );
});
