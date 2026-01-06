import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAchievements } from "@/hooks/use-achievements";
import { TIER_COLORS } from "@/lib/achievements";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight, Sparkles, Lock } from "lucide-react";

export default function AchievementsPreview() {
  const { stats, getAchievementsByCategory, isLoading } = useAchievements();

  // Get recently earned and close-to-earning achievements
  const allAchievements = [
    ...getAchievementsByCategory("foundation"),
    ...getAchievementsByCategory("credit"),
    ...getAchievementsByCategory("brand"),
    ...getAchievementsByCategory("milestone"),
  ];

  const recentlyEarned = allAchievements
    .filter(a => a.earned)
    .sort((a, b) => new Date(b.earnedAt || 0).getTime() - new Date(a.earnedAt || 0).getTime())
    .slice(0, 2);

  const readyToClaim = allAchievements
    .filter(a => !a.earned && a.requirementMet)
    .slice(0, 2);

  const upNext = allAchievements
    .filter(a => !a.earned && !a.requirementMet)
    .slice(0, 2);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="h-24 bg-muted/50 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Achievements</h3>
              <p className="text-xs text-muted-foreground">
                Level {stats.level} • {stats.earnedCount}/{stats.totalCount} earned
              </p>
            </div>
          </div>
          <Link to="/app/achievements">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Level {stats.level} → {stats.level + 1}</span>
            <span className="font-medium text-primary">{stats.currentXP}/{stats.xpForNextLevel} XP</span>
          </div>
          <Progress value={stats.progress} className="h-2" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Ready to Claim */}
        {readyToClaim.length > 0 && (
          <div>
            <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Ready to Claim
            </p>
            <div className="space-y-2">
              {readyToClaim.map(achievement => {
                const Icon = achievement.icon;
                const tierColors = TIER_COLORS[achievement.tier];
                return (
                  <motion.div
                    key={achievement.id}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border-2 border-dashed ${tierColors.border} bg-primary/5`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tierColors.bg}`}>
                      <Icon className={`h-4 w-4 ${tierColors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{achievement.name}</p>
                      <p className="text-[10px] text-muted-foreground">+{achievement.xpReward} XP</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recently Earned */}
        {recentlyEarned.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Recently Earned</p>
            <div className="space-y-2">
              {recentlyEarned.map(achievement => {
                const Icon = achievement.icon;
                const tierColors = TIER_COLORS[achievement.tier];
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg ${tierColors.bg} border ${tierColors.border}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-background/50`}>
                      <Icon className={`h-4 w-4 ${tierColors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${tierColors.text} truncate`}>{achievement.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{achievement.tier}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Up Next */}
        {upNext.length > 0 && recentlyEarned.length === 0 && readyToClaim.length === 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Up Next</p>
            <div className="space-y-2">
              {upNext.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                    <Lock className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">{achievement.name}</p>
                    <p className="text-[10px] text-muted-foreground/60">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentlyEarned.length === 0 && readyToClaim.length === 0 && upNext.length === 0 && (
          <div className="text-center py-4">
            <Trophy className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Start completing steps to earn achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
}
