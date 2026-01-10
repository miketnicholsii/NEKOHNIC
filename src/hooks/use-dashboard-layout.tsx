import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

export interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  defaultVisible: boolean;
  minWidth: "sm" | "md" | "lg" | "full";
}

// Define all available widgets
export const DASHBOARD_WIDGETS: WidgetConfig[] = [
  {
    id: "stats",
    title: "Dashboard Stats",
    description: "Overview of your progress and tasks",
    defaultVisible: true,
    minWidth: "full",
  },
  {
    id: "product-suite",
    title: "Product Suite",
    description: "Your credit building journey progress",
    defaultVisible: true,
    minWidth: "full",
  },
  {
    id: "activity-feed",
    title: "Recent Activity",
    description: "Your latest updates and achievements",
    defaultVisible: true,
    minWidth: "md",
  },
  {
    id: "streak-tracker",
    title: "Streak Tracker",
    description: "Track your login and task streaks",
    defaultVisible: true,
    minWidth: "sm",
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Your earned badges and XP",
    defaultVisible: true,
    minWidth: "sm",
  },
  {
    id: "tier-progress",
    title: "Tier Progress",
    description: "Your subscription tier benefits",
    defaultVisible: true,
    minWidth: "sm",
  },
  {
    id: "add-ons",
    title: "Add-Ons",
    description: "Premium add-on services",
    defaultVisible: true,
    minWidth: "sm",
  },
  {
    id: "next-steps",
    title: "Next Steps",
    description: "Recommended actions to take",
    defaultVisible: true,
    minWidth: "sm",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Shortcuts to common tasks",
    defaultVisible: true,
    minWidth: "sm",
  },
];

interface DashboardLayout {
  widget_order: string[];
  hidden_widgets: string[];
}

const DEFAULT_ORDER = DASHBOARD_WIDGETS.map(w => w.id);

export function useDashboardLayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [widgetOrder, setWidgetOrder] = useState<string[]>(DEFAULT_ORDER);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch layout from database
  const fetchLayout = useCallback(async () => {
    if (!user) {
      setWidgetOrder(DEFAULT_ORDER);
      setHiddenWidgets([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("dashboard_layouts")
        .select("widget_order, hidden_widgets")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Merge saved order with any new widgets
        const savedOrder = (data.widget_order as string[]) || [];
        const savedHidden = (data.hidden_widgets as string[]) || [];
        
        // Add any new widgets that weren't in the saved order
        const allWidgetIds = DASHBOARD_WIDGETS.map(w => w.id);
        const newWidgets = allWidgetIds.filter(id => !savedOrder.includes(id));
        
        setWidgetOrder([...savedOrder.filter(id => allWidgetIds.includes(id)), ...newWidgets]);
        setHiddenWidgets(savedHidden.filter(id => allWidgetIds.includes(id)));
      } else {
        setWidgetOrder(DEFAULT_ORDER);
        setHiddenWidgets([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard layout:", error);
      setWidgetOrder(DEFAULT_ORDER);
      setHiddenWidgets([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  // Save layout to database
  const saveLayout = useCallback(async (newOrder: string[], newHidden: string[]) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("dashboard_layouts")
        .upsert({
          user_id: user.id,
          widget_order: newOrder,
          hidden_widgets: newHidden,
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      toast({
        title: "Couldn't save your layout",
        description: "Try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, toast]);

  // Reorder widgets
  const reorderWidgets = useCallback((newOrder: string[]) => {
    setWidgetOrder(newOrder);
    saveLayout(newOrder, hiddenWidgets);
  }, [hiddenWidgets, saveLayout]);

  // Toggle widget visibility
  const toggleWidget = useCallback((widgetId: string) => {
    const newHidden = hiddenWidgets.includes(widgetId)
      ? hiddenWidgets.filter(id => id !== widgetId)
      : [...hiddenWidgets, widgetId];
    
    setHiddenWidgets(newHidden);
    saveLayout(widgetOrder, newHidden);
    
    toast({
      title: hiddenWidgets.includes(widgetId) ? "Widget restored" : "Widget tucked away",
      description: hiddenWidgets.includes(widgetId) 
        ? "It's back on your dashboard."
        : "You can bring it back anytime from settings.",
    });
  }, [hiddenWidgets, widgetOrder, saveLayout, toast]);

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setWidgetOrder(DEFAULT_ORDER);
    setHiddenWidgets([]);
    saveLayout(DEFAULT_ORDER, []);
    toast({
      title: "Fresh start",
      description: "Your dashboard is back to its default layout.",
    });
  }, [saveLayout, toast]);

  // Get visible widgets in order
  const visibleWidgets = widgetOrder.filter(id => !hiddenWidgets.includes(id));

  // Get widget config by ID
  const getWidgetConfig = useCallback((id: string) => {
    return DASHBOARD_WIDGETS.find(w => w.id === id);
  }, []);

  return {
    widgetOrder,
    hiddenWidgets,
    visibleWidgets,
    isLoading,
    isSaving,
    reorderWidgets,
    toggleWidget,
    resetLayout,
    getWidgetConfig,
    allWidgets: DASHBOARD_WIDGETS,
  };
}