import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface ProgressItem {
  step: string;
  module: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ModuleProgress {
  module: string;
  completed: number;
  total: number;
  percentage: number;
  steps: Record<string, ProgressItem>;
}

// Define step counts for each module
const MODULE_STEPS: Record<string, number> = {
  business_starter: 5,
  business_credit: 7,
  personal_brand: 6,
};

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const progressMap: Record<string, ProgressItem> = {};
      data?.forEach((item) => {
        const key = `${item.module}:${item.step}`;
        progressMap[key] = {
          step: item.step,
          module: item.module,
          completed: item.completed || false,
          completed_at: item.completed_at,
          notes: item.notes,
          metadata: item.metadata as Record<string, unknown> | null,
        };
      });
      setProgress(progressMap);
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getModuleProgress = (module: string): ModuleProgress => {
    const totalSteps = MODULE_STEPS[module] || 0;
    const moduleProgress = Object.values(progress).filter(
      p => p.module === module && p.completed
    );
    const completed = moduleProgress.length;
    
    const steps: Record<string, ProgressItem> = {};
    Object.entries(progress).forEach(([key, value]) => {
      if (value.module === module) {
        steps[value.step] = value;
      }
    });

    return {
      module,
      completed,
      total: totalSteps,
      percentage: totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0,
      steps,
    };
  };

  const getAllModulesProgress = (): ModuleProgress[] => {
    return Object.keys(MODULE_STEPS).map(module => getModuleProgress(module));
  };

  const getNextStep = (module: string): string | null => {
    const moduleProgress = getModuleProgress(module);
    // This would need the actual step order defined
    return null; // Placeholder
  };

  return {
    progress,
    isLoading,
    fetchProgress,
    getModuleProgress,
    getAllModulesProgress,
    getNextStep,
  };
}
