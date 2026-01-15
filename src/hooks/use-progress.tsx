import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase";
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

// Define step order for each module (order matters for getNextStep)
const MODULE_STEP_ORDER: Record<string, string[]> = {
  business_starter: [
    "create_llc",
    "get_ein",
    "open_business_bank",
    "get_business_address",
    "setup_business_phone",
  ],
  business_credit: [
    "verify_business_entity",
    "register_duns",
    "open_tradeline_1",
    "open_tradeline_2",
    "open_tradeline_3",
    "monitor_scores",
    "apply_for_credit",
  ],
  personal_brand: [
    "create_profile",
    "add_bio",
    "add_skills",
    "add_links",
    "add_projects",
    "publish_page",
  ],
};

// Derive step counts from step order
const MODULE_STEPS: Record<string, number> = Object.fromEntries(
  Object.entries(MODULE_STEP_ORDER).map(([module, steps]) => [module, steps.length])
);

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
    Object.entries(progress).forEach(([, value]) => {
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
    const stepOrder = MODULE_STEP_ORDER[module];
    if (!stepOrder) return null;

    // Find the first step that is not completed
    for (const step of stepOrder) {
      const key = `${module}:${step}`;
      const stepProgress = progress[key];
      if (!stepProgress || !stepProgress.completed) {
        return step;
      }
    }

    // All steps completed
    return null;
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
