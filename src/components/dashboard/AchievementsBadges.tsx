import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievements } from "@/hooks/use-achievements";
import { useStreaks } from "@/hooks/use-streaks";
import { TIER_COLORS, CATEGORY_LABELS, Achievement } from "@/lib/achievements";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Lock, Sparkles, Star, Zap } from "lucide-react";
import { format } from "date-fns";

interface AchievementWithStatus extends Achievement {
  earned: boolean;
  earnedAt?: string;
  requirementMet: boolean;
}

function AchievementCard({ 
  achievement, 
  onClick 
}: { 
  achievement: AchievementWithStatus;
  onClick: () => void;
}) {
  const tierColors = TIER_COLORS[achievement.tier];
  const Icon = achievement.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
        achievement.earned
          ? `${tierColors.bg} ${tierColors.border} shadow-lg ${tierColors.glow}`
          : achievement.requirementMet
            ? "bg-muted/50 border-primary/30 border-dashed"
            : "bg-muted/30 border-border/50 opacity-60"
      }`}
    >
      {/* Earned sparkle effect */}
      {achievement.earned && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className={`h-4 w-4 ${tierColors.icon}`} />
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          achievement.earned 
            ? tierColors.bg 
            : "bg-muted"
        }`}>
          {achievement.earned ? (
            <Icon className={`h-6 w-6 ${tierColors.icon}`} />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground/50" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold truncate ${
              achievement.earned ? tierColors.text : "text-muted-foreground"
            }`}>
              {achievement.name}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {achievement.description}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              achievement.earned 
                ? `${tierColors.bg} ${tierColors.text}` 
                : "bg-muted text-muted-foreground"
            }`}>
              {achievement.tier}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {achievement.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Ready to claim indicator */}
      {!achievement.earned && achievement.requirementMet && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
        />
      )}
    </motion.button>
  );
}

function AchievementModal({ 
  achievement, 
  open, 
  onClose 
}: { 
  achievement: AchievementWithStatus | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!achievement) return null;

  const tierColors = TIER_COLORS[achievement.tier];
  const Icon = achievement.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
                achievement.earned 
                  ? `${tierColors.bg} ${tierColors.border} border-2 shadow-xl ${tierColors.glow}` 
                  : "bg-muted border-2 border-border"
              }`}
            >
              {achievement.earned ? (
                <Icon className={`h-12 w-12 ${tierColors.icon}`} />
              ) : (
                <Lock className="h-10 w-10 text-muted-foreground/50" />
              )}
            </motion.div>
          </div>
          
          <DialogTitle className={`text-xl ${achievement.earned ? tierColors.text : ""}`}>
            {achievement.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            {achievement.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className={`font-bold uppercase tracking-wider px-3 py-1 rounded-full ${tierColors.bg} ${tierColors.text}`}>
              {achievement.tier}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Zap className="h-4 w-4 text-accent-gold" />
              {achievement.xpReward} XP Reward
            </span>
          </div>

          {achievement.earned && achievement.earnedAt && (
            <div className="text-center text-sm text-muted-foreground">
              Earned on {format(new Date(achievement.earnedAt), "MMMM d, yyyy")}
            </div>
          )}

          {!achievement.earned && (
            <div className={`p-4 rounded-xl text-center ${
              achievement.requirementMet 
                ? "bg-primary/10 border border-primary/20" 
                : "bg-muted/50"
            }`}>
              {achievement.requirementMet ? (
                <p className="text-sm text-primary font-medium">
                  ✨ Requirements met! This achievement is ready to claim.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keep progressing to unlock this achievement!
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AchievementsBadges() {
  const { streaks } = useStreaks();
  const { stats, getAchievementsByCategory, isLoading } = useAchievements({
    login_streak_current: streaks.login_streak_current,
    task_streak_current: streaks.task_streak_current,
  });
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementWithStatus | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", "foundation", "credit", "brand", "milestone", "streak", "special"] as const;

  const getAchievementsForTab = (category: string) => {
    if (category === "all") {
      return categories.slice(1).flatMap(cat => getAchievementsByCategory(cat as Achievement["category"]));
    }
    return getAchievementsByCategory(category as Achievement["category"]);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-card to-accent-gold/5 border border-border rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-2xl font-display font-bold text-primary-foreground">
                  {stats.level}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-gold flex items-center justify-center shadow-md">
                <Star className="h-4 w-4 text-accent-gold-foreground" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Level {stats.level}</h2>
              <p className="text-sm text-muted-foreground">
                {stats.totalXP.toLocaleString()} total XP earned
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress to Level {stats.level + 1}</span>
              <span className="font-medium text-primary">{stats.progress}%</span>
            </div>
            <Progress value={stats.progress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.currentXP} / {stats.xpForNextLevel} XP
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">{stats.earnedCount}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">{stats.totalCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-primary">{stats.completionPercentage}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          {categories.slice(1).map(cat => (
            <TabsTrigger key={cat} value={cat} className="text-xs capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value={activeCategory} className="mt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {getAchievementsForTab(activeCategory).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <AchievementCard 
                      achievement={achievement}
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
}
