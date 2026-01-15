import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from "@/components/ui/confetti";
import { StrategyTour } from "@/components/StrategyTour";
import { useStrategyTour } from "@/hooks/use-strategy-tour";
import { supabase } from "@/integrations/supabase";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { tierMeetsRequirement } from "@/lib/subscription-tiers";
import { PageLoader } from "@/components/LoadingStates";
import {
  Gift,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  FileText,
  Mail,
  Award,
  Lightbulb,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  tier_required: string;
  read_time_minutes: number | null;
  sort_order: number | null;
}

const STRATEGY_STORAGE_KEY = "neko-strategy-progress";

// Step icons mapping based on sort order
const STEP_ICONS = [
  Lightbulb,  // Why Lead with Value
  Gift,       // Designing Your Free Offer
  Target,     // Positioning Your Offer
  FileText,   // Landing Page Essentials
  Mail,       // The Follow-Up Sequence
  Award,      // Building Credibility Assets
];

export default function Strategy() {
  const { tier: effectiveTier } = useSubscriptionTier();
  const { showTour, completeTour } = useStrategyTour();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasShownConfettiRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STRATEGY_STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    loadStrategyResources();
  }, []);

  useEffect(() => {
    localStorage.setItem(STRATEGY_STORAGE_KEY, JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  const loadStrategyResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("category", "strategy")
        .eq("is_published", true)
        .order("sort_order");

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error loading strategy resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Access check available for future tier-gated content
  const _hasAccess = (resourceTier: string): boolean => {
    return tierMeetsRequirement(effectiveTier, resourceTier);
  };

  const markComplete = (resourceId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(resourceId);
      return next;
    });
  };

  const markIncomplete = (resourceId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete(resourceId);
      return next;
    });
  };

  const goToNext = () => {
    if (activeStep < resources.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const goToPrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const progressPercent = resources.length > 0 
    ? (completedSteps.size / resources.length) * 100 
    : 0;

  if (isLoading) {
    return <PageLoader message="Loading strategy guide..." />;
  }

  if (resources.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">
          Strategy Guide Coming Soon
        </h1>
        <p className="text-muted-foreground mb-6">
          We're crafting something special. Check back soon.
        </p>
        <Link to="/app/resources">
          <Button variant="outline">
            Browse All Resources
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const currentResource = resources[activeStep];
  const StepIcon = STEP_ICONS[activeStep] || BookOpen;
  const isCurrentCompleted = completedSteps.has(currentResource.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Onboarding Tour */}
      {showTour && <StrategyTour onComplete={completeTour} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              The Art of Generous First Impressions
            </h1>
            <p className="text-muted-foreground">
              A calm, strategic approach to building trust through value
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.size} of {resources.length} complete
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Step Navigation Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 lg:sticky lg:top-24">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Strategy Steps
            </h3>
            <nav className="space-y-1">
              {resources.map((resource, index) => {
                const isActive = index === activeStep;
                const isCompleted = completedSteps.has(resource.id);
                const _Icon = STEP_ICONS[index] || BookOpen;

                return (
                  <button
                    key={resource.id}
                    onClick={() => setActiveStep(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-green-500"}`} />
                      ) : (
                        <Circle className={`h-4 w-4 ${isActive ? "text-primary-foreground/60" : "text-muted-foreground/50"}`} />
                      )}
                    </div>
                    <span className="truncate flex-1">{resource.title}</span>
                    {resource.read_time_minutes && (
                      <span className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {resource.read_time_minutes}m
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentResource.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Step Header */}
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Step {activeStep + 1} of {resources.length}
                      </Badge>
                      {currentResource.read_time_minutes && (
                        <span className="text-xs text-muted-foreground">
                          {currentResource.read_time_minutes} min read
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-1">
                      {currentResource.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {currentResource.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {currentResource.content}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Completion Toggle */}
                  <button
                    onClick={() =>
                      isCurrentCompleted
                        ? markIncomplete(currentResource.id)
                        : markComplete(currentResource.id)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrentCompleted
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {isCurrentCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </button>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrev}
                      disabled={activeStep === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    {activeStep < resources.length - 1 ? (
                      <Button size="sm" onClick={goToNext}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Link to="/app/resources">
                        <Button size="sm" variant="outline">
                          All Resources
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Completion Celebration */}
          {completedSteps.size === resources.length && resources.length > 0 && (
            <>
              {showConfetti && <Confetti />}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onAnimationComplete={() => {
                  if (!hasShownConfettiRef.current) {
                    hasShownConfettiRef.current = true;
                    setShowConfetti(true);
                    // Auto-hide confetti after animation
                    setTimeout(() => setShowConfetti(false), 4000);
                  }
                }}
                className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 text-center"
              >
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                You've completed the Strategy Guide!
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                You now have the foundation to create generous first impressions that build lasting trust.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/app/resources">
                  <Button variant="outline">
                    Explore More Resources
                  </Button>
                </Link>
                <Link to="/app/business-starter">
                  <Button variant="cta">
                    Continue Your Journey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
