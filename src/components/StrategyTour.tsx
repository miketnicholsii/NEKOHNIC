import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ListChecks,
  CheckCircle2,
  Gift,
} from "lucide-react";

const TOUR_STORAGE_KEY = "neko-strategy-tour-completed";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  targetId?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Strategy Guide",
    description: "This is a step-by-step walkthrough designed to help you create generous first impressions that build trust and open doors. Take your time—there's no rush.",
    icon: Gift,
  },
  {
    id: "navigation",
    title: "Navigate at Your Own Pace",
    description: "Use the sidebar to jump between steps, or use the Previous/Next buttons to move through in order. Each step builds on the last.",
    icon: ListChecks,
    targetId: "strategy-sidebar",
  },
  {
    id: "progress",
    title: "Track Your Progress",
    description: "Mark each step complete as you finish it. Your progress is saved automatically, so you can pick up where you left off anytime.",
    icon: CheckCircle2,
    targetId: "strategy-progress",
  },
  {
    id: "celebrate",
    title: "Celebrate Your Wins",
    description: "When you complete all steps, you'll see a special celebration. Small wins matter—each step forward is progress.",
    icon: Sparkles,
  },
];

interface StrategyTourProps {
  onComplete: () => void;
}

export function StrategyTour({ onComplete }: StrategyTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            onClick={handleSkip}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md mx-4"
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 via-background to-accent/5">
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Skip tour"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Step {currentStep + 1} of {TOUR_STEPS.length}
                    </p>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 pb-4">
                {TOUR_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-primary w-6"
                        : index < currentStep
                        ? "bg-primary/50"
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-4 pt-0 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>
                  <Button size="sm" onClick={handleNext} className="gap-1">
                    {isLastStep ? (
                      <>
                        Get Started
                        <Sparkles className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
