import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { differenceInDays, parseISO, format, isToday, isYesterday } from "date-fns";

interface UserStreaks {
  id: string;
  user_id: string;
  login_streak_current: number;
  login_streak_longest: number;
  last_login_date: string | null;
  task_streak_current: number;
  task_streak_longest: number;
  last_task_date: string | null;
  total_login_days: number;
  total_tasks_completed: number;
  created_at: string;
  updated_at: string;
}

const DEFAULT_STREAKS: Omit<UserStreaks, "id" | "user_id" | "created_at" | "updated_at"> = {
  login_streak_current: 0,
  login_streak_longest: 0,
  last_login_date: null,
  task_streak_current: 0,
  task_streak_longest: 0,
  last_task_date: null,
  total_login_days: 0,
  total_tasks_completed: 0,
};

export function useStreaks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streaks, setStreaks] = useState<UserStreaks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRecordedLoginToday, setHasRecordedLoginToday] = useState(false);

  // Fetch or create streak record
  const fetchStreaks = useCallback(async () => {
    if (!user) {
      setStreaks(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No record exists, create one
        const { data: newData, error: insertError } = await supabase
          .from("user_streaks")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setStreaks(newData);
      } else if (error) {
        throw error;
      } else {
        setStreaks(data);
        
        // Check if we already recorded login today
        if (data.last_login_date) {
          const lastLogin = parseISO(data.last_login_date);
          setHasRecordedLoginToday(isToday(lastLogin));
        }
      }
    } catch (error) {
      console.error("Error fetching streaks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  // Record daily login
  const recordLogin = useCallback(async () => {
    if (!user || !streaks || hasRecordedLoginToday) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const lastLoginDate = streaks.last_login_date;
    
    let newLoginStreak = 1;
    let isStreakContinued = false;

    if (lastLoginDate) {
      const lastLogin = parseISO(lastLoginDate);
      const daysDiff = differenceInDays(new Date(), lastLogin);

      if (daysDiff === 1) {
        // Consecutive day - continue streak
        newLoginStreak = streaks.login_streak_current + 1;
        isStreakContinued = true;
      } else if (daysDiff === 0) {
        // Same day - already recorded
        return;
      }
      // daysDiff > 1 means streak is broken, reset to 1
    }

    const newLongestStreak = Math.max(streaks.login_streak_longest, newLoginStreak);

    try {
      const { error } = await supabase
        .from("user_streaks")
        .update({
          login_streak_current: newLoginStreak,
          login_streak_longest: newLongestStreak,
          last_login_date: today,
          total_login_days: streaks.total_login_days + 1,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setHasRecordedLoginToday(true);
      setStreaks(prev => prev ? {
        ...prev,
        login_streak_current: newLoginStreak,
        login_streak_longest: newLongestStreak,
        last_login_date: today,
        total_login_days: prev.total_login_days + 1,
      } : null);

      // Show streak notification for milestones
      if (newLoginStreak > 1 && (newLoginStreak === 3 || newLoginStreak === 7 || newLoginStreak === 14 || newLoginStreak === 30 || newLoginStreak % 30 === 0)) {
        toast({
          title: `🔥 ${newLoginStreak} Day Login Streak!`,
          description: isStreakContinued 
            ? "Keep it up! You're on fire!" 
            : "Welcome back! Start building your streak.",
        });
      }
    } catch (error) {
      console.error("Error recording login:", error);
    }
  }, [user, streaks, hasRecordedLoginToday, toast]);

  // Auto-record login when hook initializes
  useEffect(() => {
    if (!isLoading && streaks && !hasRecordedLoginToday) {
      recordLogin();
    }
  }, [isLoading, streaks, hasRecordedLoginToday, recordLogin]);

  // Record task completion
  const recordTaskCompletion = useCallback(async () => {
    if (!user || !streaks) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const lastTaskDate = streaks.last_task_date;
    
    let newTaskStreak = streaks.task_streak_current;
    const isSameDay = lastTaskDate === today;

    if (!isSameDay) {
      if (lastTaskDate) {
        const lastTask = parseISO(lastTaskDate);
        const daysDiff = differenceInDays(new Date(), lastTask);

        if (daysDiff === 1) {
          // Consecutive day - continue streak
          newTaskStreak = streaks.task_streak_current + 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newTaskStreak = 1;
        }
      } else {
        newTaskStreak = 1;
      }
    }

    const newLongestStreak = Math.max(streaks.task_streak_longest, newTaskStreak);

    try {
      const { error } = await supabase
        .from("user_streaks")
        .update({
          task_streak_current: newTaskStreak,
          task_streak_longest: newLongestStreak,
          last_task_date: today,
          total_tasks_completed: streaks.total_tasks_completed + 1,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setStreaks(prev => prev ? {
        ...prev,
        task_streak_current: newTaskStreak,
        task_streak_longest: newLongestStreak,
        last_task_date: today,
        total_tasks_completed: prev.total_tasks_completed + 1,
      } : null);

      // Show streak notification for task milestones
      if (!isSameDay && newTaskStreak > 1 && (newTaskStreak === 3 || newTaskStreak === 7 || newTaskStreak === 14 || newTaskStreak === 30)) {
        toast({
          title: `⚡ ${newTaskStreak} Day Task Streak!`,
          description: "You're crushing your goals!",
        });
      }
    } catch (error) {
      console.error("Error recording task completion:", error);
    }
  }, [user, streaks, toast]);

  // Check if streaks are at risk (haven't logged in/completed task today)
  const streakStatus = useMemo(() => {
    if (!streaks) return { loginAtRisk: false, taskAtRisk: false };

    const loginAtRisk = streaks.last_login_date 
      ? !isToday(parseISO(streaks.last_login_date)) && !isYesterday(parseISO(streaks.last_login_date))
      : false;

    const taskAtRisk = streaks.last_task_date
      ? !isToday(parseISO(streaks.last_task_date)) && streaks.task_streak_current > 0
      : false;

    return { loginAtRisk, taskAtRisk };
  }, [streaks]);

  return {
    streaks: streaks || DEFAULT_STREAKS as UserStreaks,
    isLoading,
    recordLogin,
    recordTaskCompletion,
    streakStatus,
    refetch: fetchStreaks,
  };
}
