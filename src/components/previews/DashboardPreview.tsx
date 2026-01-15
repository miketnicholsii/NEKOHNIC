import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  LayoutGrid, 
  ListChecks, 
  Trophy, 
  Flame,
  Building2,
  CreditCard,
  User,
  ChevronRight,
  Calendar,
  Bell,
  Target,
  Sparkles
} from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const stats = [
  { label: "Steps Completed", value: "12", change: "+3 this week", icon: Target },
  { label: "Current Streak", value: "7", suffix: "days", icon: Flame },
  { label: "Credit Tier", value: "1", suffix: "of 3", icon: CreditCard },
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
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/95 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Good morning, Alex</h3>
              <p className="text-xs text-muted-foreground">Here's your progress overview</p>
            </div>
          </div>
          <motion.div 
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Flame className="h-4 w-4 text-secondary" />
            </motion.div>
            <span className="text-xs font-semibold text-secondary">7 day streak</span>
          </motion.div>
        </motion.div>

        {/* Stats Grid - Responsive for mobile */}
        <motion.div 
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 sm:gap-3 mb-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
              className="p-2.5 sm:p-3.5 rounded-xl bg-card border border-border shadow-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-1 flex items-center gap-1 sm:gap-1.5 truncate">
                  <stat.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary/70 flex-shrink-0" />
                  <span className="truncate">{stat.label}</span>
                </p>
                <div className="flex items-baseline gap-0.5 sm:gap-1">
                  <span className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</span>
                  {stat.suffix && (
                    <span className="text-[9px] sm:text-xs text-muted-foreground">{stat.suffix}</span>
                  )}
                </div>
                {stat.change && (
                  <p className="text-[9px] sm:text-[10px] text-primary mt-0.5 sm:mt-1 font-medium truncate">{stat.change}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {/* Quick Actions */}
          <motion.div 
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                Continue Building
              </h4>
            </div>
            <motion.div 
              variants={prefersReducedMotion ? {} : staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-2.5"
            >
              {quickActions.map((action) => (
                <motion.div
                  key={action.label}
                  variants={prefersReducedMotion ? {} : staggerItem}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={prefersReducedMotion ? { width: `${action.progress}%` } : { width: 0 }}
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
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5 text-primary" />
                Recent Activity
              </h4>
            </div>
            <motion.div 
              variants={prefersReducedMotion ? {} : staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-1"
            >
              {recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  variants={prefersReducedMotion ? {} : staggerItem}
                  className="flex items-start gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <motion.div 
                    initial={prefersReducedMotion ? {} : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.type === "success" ? "bg-primary" : "bg-secondary"
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
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header - Mobile responsive */}
      <motion.div 
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/20 flex-shrink-0">
            <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground">Good morning, Alex</h2>
            <p className="text-xs sm:text-base text-muted-foreground">Let's keep building your business foundation.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-secondary/15 to-secondary/5 border border-secondary/30">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
            <span className="text-xs sm:text-base font-semibold text-secondary">7 day streak</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Mobile responsive */}
      <motion.div 
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
      >
        {expandedStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={prefersReducedMotion ? {} : staggerItem}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
            className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-[10px] sm:text-sm text-muted-foreground">{stat.suffix}</span>
                )}
              </div>
              {stat.change && (
                <p className="text-[10px] sm:text-xs text-primary mt-1 sm:mt-1.5 font-medium">{stat.change}</p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div 
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Continue Building</h4>
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm ring-1 ring-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={prefersReducedMotion ? { width: `${action.progress}%` } : { width: 0 }}
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
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Upcoming Tasks</h4>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.08 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 3 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    task.priority === "high" ? "bg-secondary" : 
                    task.priority === "medium" ? "bg-accent-gold" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.due}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
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
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent-gold" />
            <h4 className="font-semibold text-foreground">Achievements</h4>
          </div>
          <button className="text-xs text-primary hover:underline font-medium">View All</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.08 }}
              className={`p-4 rounded-xl text-center transition-all ${
                achievement.earned 
                  ? "bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 border border-accent-gold/30" 
                  : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                achievement.earned ? "bg-accent-gold/20" : "bg-muted"
              }`}>
                <Trophy className={`h-5 w-5 ${achievement.earned ? "text-accent-gold" : "text-muted-foreground"}`} />
              </div>
              <p className={`font-medium text-sm ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
                {achievement.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
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
