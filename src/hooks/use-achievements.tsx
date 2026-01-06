import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useProgress } from "./use-progress";
import { ACHIEVEMENTS, Achievement, calculateLevel } from "@/lib/achievements";
import { useToast } from "./use-toast";

interface EarnedAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  metadata: unknown;
}

export function useAchievements() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { toast } = useToast();
  const [earnedAchievements, setEarnedAchievements] = useState<EarnedAchievement[]>([]);
  const [tradelineCount, setTradelineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch earned achievements
  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setEarnedAchievements([]);
      setIsLoading(false);
      return;
    }

    try {
      const [achievementsResult, tradelinesResult] = await Promise.all([
        supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("tradelines")
          .select("id")
          .eq("user_id", user.id),
      ]);

      if (achievementsResult.error) throw achievementsResult.error;
      if (tradelinesResult.error) throw tradelinesResult.error;

      setEarnedAchievements(achievementsResult.data || []);
      setTradelineCount(tradelinesResult.data?.length || 0);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Calculate completed progress steps
  const completedSteps = useMemo(() => {
    return Object.values(progress).filter(p => p.completed).length;
  }, [progress]);

  // Calculate module-specific progress
  const moduleProgress = useMemo(() => {
    const modules: Record<string, number> = {};
    Object.entries(progress).forEach(([key, value]) => {
      if (value.completed) {
        const module = key.split("-")[0];
        modules[module] = (modules[module] || 0) + 1;
      }
    });
    return modules;
  }, [progress]);

  // Check if achievement is earned
  const isEarned = useCallback((achievementId: string) => {
    return earnedAchievements.some(a => a.achievement_id === achievementId);
  }, [earnedAchievements]);

  // Check if achievement requirements are met
  const checkRequirementMet = useCallback((achievement: Achievement): boolean => {
    const { requirement } = achievement;

    switch (requirement.type) {
      case "progress_step":
        if (requirement.module && requirement.step) {
          const key = `${requirement.module}-${requirement.step}`;
          return progress[key]?.completed || false;
        }
        return false;

      case "progress_count":
        if (requirement.module) {
          return (moduleProgress[requirement.module] || 0) >= (requirement.count || 0);
        }
        return completedSteps >= (requirement.count || 0);

      case "tradeline_count":
        return tradelineCount >= (requirement.count || 0);

      case "special":
        // Handle special achievements
        if (achievement.id === "all_modules_started") {
          const modulesStarted = Object.keys(moduleProgress).length;
          return modulesStarted >= 3;
        }
        if (achievement.id === "early_adopter") {
          // Auto-grant to users who joined before a certain date
          return user?.created_at ? new Date(user.created_at) < new Date("2025-06-01") : false;
        }
        return false;

      default:
        return false;
    }
  }, [progress, moduleProgress, completedSteps, tradelineCount, user]);

  // Award achievement
  const awardAchievement = useCallback(async (achievementId: string) => {
    if (!user || isEarned(achievementId)) return;

    try {
      const { error } = await supabase
        .from("user_achievements")
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
        });

      if (error) throw error;

      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.name} - ${achievement.description}`,
        });
      }

      fetchAchievements();
    } catch (error) {
      console.error("Error awarding achievement:", error);
    }
  }, [user, isEarned, toast, fetchAchievements]);

  // Check and award pending achievements
  const checkAndAwardAchievements = useCallback(async () => {
    if (!user) return;

    for (const achievement of ACHIEVEMENTS) {
      if (!isEarned(achievement.id) && checkRequirementMet(achievement)) {
        await awardAchievement(achievement.id);
      }
    }
  }, [user, isEarned, checkRequirementMet, awardAchievement]);

  // Run achievement check when progress changes
  useEffect(() => {
    if (!isLoading && user) {
      checkAndAwardAchievements();
    }
  }, [progress, tradelineCount, isLoading, user, checkAndAwardAchievements]);

  // Calculate total XP and level
  const stats = useMemo(() => {
    const totalXP = earnedAchievements.reduce((sum, earned) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === earned.achievement_id);
      return sum + (achievement?.xpReward || 0);
    }, 0);

    const levelInfo = calculateLevel(totalXP);
    const earnedCount = earnedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;

    return {
      totalXP,
      ...levelInfo,
      earnedCount,
      totalCount,
      completionPercentage: Math.round((earnedCount / totalCount) * 100),
    };
  }, [earnedAchievements]);

  // Get achievements by category
  const getAchievementsByCategory = useCallback((category: Achievement["category"]) => {
    return ACHIEVEMENTS.filter(a => a.category === category).map(achievement => ({
      ...achievement,
      earned: isEarned(achievement.id),
      earnedAt: earnedAchievements.find(e => e.achievement_id === achievement.id)?.earned_at,
      requirementMet: checkRequirementMet(achievement),
    }));
  }, [isEarned, earnedAchievements, checkRequirementMet]);

  return {
    achievements: ACHIEVEMENTS,
    earnedAchievements,
    isLoading,
    isEarned,
    stats,
    getAchievementsByCategory,
    checkAndAwardAchievements,
    refetch: fetchAchievements,
  };
}
