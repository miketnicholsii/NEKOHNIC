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
  Zap,
  Sparkles
} from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const stats = [
  { label: "Steps Completed", value: "12", change: "+3 this week", icon: Target, color: "from-primary/20 to-primary/5" },
  { label: "Current Streak", value: "7", suffix: "days", icon: Flame, color: "from-secondary/20 to-secondary/5" },
  { label: "Credit Tier", value: "1", suffix: "of 3", icon: CreditCard, color: "from-accent/20 to-accent/5" },
];

const quickActions = [
  { icon: Building2, label: "Business Starter", progress: 40, color: "from-primary/20 to-primary/5" },
  { icon: CreditCard, label: "Credit Builder", progress: 25, color: "from-secondary/20 to-secondary/5" },
  { icon: User, label: "Personal Brand", progress: 60, color: "from-accent/20 to-accent/5" },
];

const recentActivity = [
  { text: "Completed EIN application", time: "2 hours ago", type: "success" },
  { text: "Added Uline tradeline", time: "Yesterday", type: "info" },
  { text: "Published Digital CV", time: "3 days ago", type: "success" },
];

const expandedStats = [
  { label: "Steps Completed", value: "12", change: "+3 this week", icon: Target, color: "from-primary/20 to-primary/5" },
  { label: "Current Streak", value: "7", suffix: "days", icon: Flame, color: "from-secondary/20 to-secondary/5" },
  { label: "Credit Tier", value: "1", suffix: "of 3", icon: CreditCard, color: "from-accent/20 to-accent/5" },
  { label: "Achievements", value: "5", suffix: "earned", icon: Trophy, color: "from-primary/20 to-secondary/5" },
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

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Good morning, Alex</h3>
              <p className="text-xs text-muted-foreground">Here's your progress overview</p>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Flame className="h-4 w-4 text-secondary" />
            </motion.div>
            <span className="text-xs font-semibold text-secondary">7 day streak</span>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 mb-5"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-3.5 rounded-xl bg-card border border-border shadow-sm relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1.5">
                  <stat.icon className="h-3 w-3" />
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  {stat.suffix && (
                    <span className="text-xs text-muted-foreground">{stat.suffix}</span>
                  )}
                </div>
                {stat.change && (
                  <p className="text-[10px] text-primary mt-1 font-medium">{stat.change}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                Continue Building
              </h4>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-2.5"
            >
              {quickActions.map((action) => (
                <motion.div
                  key={action.label}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${action.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{action.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                Recent Activity
              </h4>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-1"
            >
              {recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === "success" ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Good morning, Alex</h2>
            <p className="text-muted-foreground">Let's keep building your business foundation.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30">
            <Flame className="h-5 w-5 text-secondary" />
            <span className="font-semibold text-secondary">7 day streak</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4"
      >
        {expandedStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-5 rounded-2xl bg-card border border-border relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2.5">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
              {stat.change && (
                <p className="text-xs text-primary mt-1.5 font-medium">{stat.change}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-foreground">Continue Building</h4>
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm`}>
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${action.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{action.progress}%</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-foreground">Upcoming Tasks</h4>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.08 }}
                whileHover={{ scale: 1.01, x: 3 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    task.priority === "high" ? "bg-destructive" : 
                    task.priority === "medium" ? "bg-secondary" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.due}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  Start
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-foreground">Recent Achievements</h4>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`p-5 rounded-xl text-center transition-all cursor-pointer ${
                achievement.earned 
                  ? "bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10" 
                  : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <motion.div 
                whileHover={{ rotate: 10 }}
                className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                  achievement.earned ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
                }`}
              >
                <Trophy className="h-6 w-6" />
              </motion.div>
              <p className="font-semibold text-foreground text-sm">{achievement.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Action Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Ready to continue?</p>
            <p className="text-sm text-muted-foreground">Pick up where you left off with your next task.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
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
