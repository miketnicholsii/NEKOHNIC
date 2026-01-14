import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase";
import { FeatureGate } from "@/components/FeatureGate";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import { PageLoader } from "@/components/LoadingStates";
import CreditBuildingSteps from "@/components/business-credit/CreditBuildingSteps";
import TradelineTracker from "@/components/business-credit/TradelineTracker";
import ScoreMonitoring from "@/components/business-credit/ScoreMonitoring";
import {
  TrendingUp,
  CreditCard,
  BarChart3,
  Lock,
} from "lucide-react";
import type { Feature } from "@/lib/entitlements";

// Tab configuration with feature requirements
const TABS = [
  { 
    id: "steps", 
    label: "Credit Building", 
    icon: TrendingUp, 
    feature: "credit_building_steps" as Feature,
  },
  { 
    id: "tradelines", 
    label: "Tradelines", 
    icon: CreditCard, 
    feature: "tradeline_tracker" as Feature,
  },
  { 
    id: "scores", 
    label: "Score Monitoring", 
    icon: BarChart3, 
    feature: "score_monitoring" as Feature,
  },
] as const;

export default function BusinessCredit() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("steps");
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Feature access hooks for tabs
  const tradelineAccess = useFeatureGate("tradeline_tracker");
  const scoreAccess = useFeatureGate("score_monitoring");

  // Load credit building progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("step, completed")
          .eq("user_id", user.id)
          .eq("module", "business_credit");

        if (error) throw error;

        const progressMap: Record<string, boolean> = {};
        data?.forEach((item) => {
          progressMap[item.step] = item.completed || false;
        });
        setProgress(progressMap);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // Helper to check if tab is accessible
  const getTabAccess = (tabId: string): boolean => {
    switch (tabId) {
      case "tradelines":
        return tradelineAccess.hasAccess;
      case "scores":
        return scoreAccess.hasAccess;
      default:
        return true;
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading credit builder..." />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Business Credit Builder
        </h1>
        <p className="text-muted-foreground">
          Build a strong credit foundation for your business — one thoughtful step at a time.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
          {TABS.map((tab) => {
            const hasAccess = getTabAccess(tab.id);
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={!hasAccess}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                {hasAccess ? (
                  <tab.icon className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="steps" className="mt-0">
              <CreditBuildingSteps 
                progress={progress} 
                setProgress={setProgress}
                userId={user?.id || ""}
              />
            </TabsContent>

            <TabsContent value="tradelines" className="mt-0">
              <FeatureGate 
                feature="tradeline_tracker"
                lockedTitle="Tradeline Tracker"
                lockedDescription="Keep tabs on your vendor accounts, credit limits, and payment status — all the pieces that build your credit profile."
              >
                <TradelineTracker userId={user?.id || ""} />
              </FeatureGate>
            </TabsContent>

            <TabsContent value="scores" className="mt-0">
              <FeatureGate 
                feature="score_monitoring"
                lockedTitle="Score Monitoring"
                lockedDescription="See your business credit scores from Dun & Bradstreet, Experian, and Equifax — all in one calm, clear view."
              >
                <ScoreMonitoring userId={user?.id || ""} />
              </FeatureGate>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
