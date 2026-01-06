import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { tierMeetsRequirement } from "@/lib/subscription-tiers";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  Landmark,
  Phone,
  Mail,
  Lock,
  BookOpen,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StepData {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  checklist: string[];
  resources: { title: string; tier: "free" | "start" | "build" | "scale" }[];
}

const STEPS: StepData[] = [
  {
    id: "registered_business",
    title: "Registered Business",
    icon: Building2,
    description: "Forming your business entity (LLC, Corporation, etc.) creates legal separation between you and your business, protects personal assets, and gives your business credibility.",
    checklist: [
      "Choose your business structure (LLC recommended for most)",
      "Select a state for registration",
      "Choose a unique business name",
      "File formation documents with the state",
      "Receive your Certificate of Formation",
      "Create an Operating Agreement",
    ],
    resources: [
      { title: "LLC Formation Guide", tier: "free" },
      { title: "State-by-State Requirements", tier: "start" },
      { title: "Operating Agreement Template", tier: "build" },
    ],
  },
  {
    id: "ein_number",
    title: "EIN Number",
    icon: FileText,
    description: "An Employer Identification Number (EIN) is your business's tax ID. It's required for opening business bank accounts, hiring employees, and building business credit.",
    checklist: [
      "Have your LLC/business formation documents ready",
      "Go to IRS.gov/EIN",
      "Complete the online application (free)",
      "Receive your EIN immediately upon completion",
      "Save the confirmation letter (SS-4)",
    ],
    resources: [
      { title: "EIN Application Walkthrough", tier: "free" },
      { title: "What to Do After Getting Your EIN", tier: "start" },
    ],
  },
  {
    id: "business_bank",
    title: "Business Bank Account",
    icon: Landmark,
    description: "A dedicated business bank account separates personal and business finances, makes tax filing easier, and is essential for building business credit.",
    checklist: [
      "Gather required documents (EIN letter, formation docs, ID)",
      "Research banks with good small business features",
      "Compare fees, minimum balances, and features",
      "Open the account in person or online",
      "Set up online banking and bill pay",
      "Order business checks if needed",
    ],
    resources: [
      { title: "Best Banks for Small Business", tier: "free" },
      { title: "Business Banking Comparison Chart", tier: "start" },
      { title: "Banking Relationship Strategy", tier: "build" },
    ],
  },
  {
    id: "business_phone",
    title: "Business Phone",
    icon: Phone,
    description: "A dedicated business phone number adds professionalism, keeps your personal number private, and is required for many business credit applications.",
    checklist: [
      "Choose a business phone service (VoIP recommended)",
      "Select a local or toll-free number",
      "Set up voicemail with professional greeting",
      "Configure call forwarding if needed",
      "Add the number to your business cards and website",
    ],
    resources: [
      { title: "Business Phone Options Guide", tier: "free" },
      { title: "Professional Voicemail Scripts", tier: "start" },
    ],
  },
  {
    id: "professional_email",
    title: "Professional Email",
    icon: Mail,
    description: "A professional email address (you@yourbusiness.com) builds credibility and trust with customers, vendors, and lenders.",
    checklist: [
      "Register a domain name for your business",
      "Choose an email hosting provider",
      "Set up your primary email address",
      "Configure email signature with business info",
      "Set up email forwarding if needed",
    ],
    resources: [
      { title: "Domain & Email Setup Guide", tier: "free" },
      { title: "Email Signature Templates", tier: "start" },
      { title: "Business Email Best Practices", tier: "build" },
    ],
  },
];

interface ProgressItem {
  step: string;
  completed: boolean;
  notes: string | null;
  checklist_status?: Record<string, boolean>;
}

export default function BusinessStarter() {
  const { user, subscription } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});
  const [notes, setNotes] = useState("");
  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResources, setShowResources] = useState(false);

  const currentStepData = STEPS[currentStep];
  const userTier = subscription?.tier || "free";

  // Load progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("module", "business_starter");

        if (error) throw error;

        const progressMap: Record<string, ProgressItem> = {};
        data?.forEach((item) => {
          const metadata = item.metadata as { checklist_status?: Record<string, boolean> } | null;
          progressMap[item.step] = {
            step: item.step,
            completed: item.completed || false,
            notes: item.notes,
            checklist_status: metadata?.checklist_status || {},
          };
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

  // Update local state when step changes
  useEffect(() => {
    const stepProgress = progress[currentStepData.id];
    setNotes(stepProgress?.notes || "");
    setChecklistStatus(stepProgress?.checklist_status || {});
  }, [currentStep, progress, currentStepData.id]);

  const handleChecklistToggle = (index: number) => {
    setChecklistStatus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const stepId = currentStepData.id;
      const allChecked = currentStepData.checklist.every((_, i) => checklistStatus[i]);
      
      const { error } = await supabase
        .from("progress")
        .upsert({
          user_id: user.id,
          module: "business_starter",
          step: stepId,
          completed: allChecked,
          completed_at: allChecked ? new Date().toISOString() : null,
          notes: notes || null,
          metadata: { checklist_status: checklistStatus },
        }, {
          onConflict: "user_id,module,step"
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [stepId]: {
          step: stepId,
          completed: allChecked,
          notes,
          checklist_status: checklistStatus,
        }
      }));

      toast.success("Progress saved!");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user) return;
    
    // Mark all checklist items as complete
    const allChecked: Record<string, boolean> = {};
    currentStepData.checklist.forEach((_, i) => {
      allChecked[i] = true;
    });
    setChecklistStatus(allChecked);
    
    setIsSaving(true);
    try {
      const stepId = currentStepData.id;
      
      const { error } = await supabase
        .from("progress")
        .upsert({
          user_id: user.id,
          module: "business_starter",
          step: stepId,
          completed: true,
          completed_at: new Date().toISOString(),
          notes: notes || null,
          metadata: { checklist_status: allChecked },
        }, {
          onConflict: "user_id,module,step"
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [stepId]: {
          step: stepId,
          completed: true,
          notes,
          checklist_status: allChecked,
        }
      }));

      toast.success("Step completed! 🎉");
      
      // Auto-advance to next step if not on last step
      if (currentStep < STEPS.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 500);
      }
    } catch (error) {
      console.error("Error marking complete:", error);
      toast.error("Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const completedSteps = STEPS.filter(s => progress[s.id]?.completed).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Business Starter
        </h1>
        <p className="text-muted-foreground">
          Your guided workflow to establish business legitimacy. {completedSteps} of {STEPS.length} steps completed.
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(completedSteps / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Step Navigation Sidebar */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-4">Steps</h2>
          <nav className="space-y-2">
            {STEPS.map((step, index) => {
              const isCompleted = progress[step.id]?.completed;
              const isCurrent = index === currentStep;
              const Icon = step.icon;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step Header */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <currentStepData.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {currentStepData.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {currentStepData.description}
                    </p>
                  </div>
                  {progress[currentStepData.id]?.completed && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </div>
                  )}
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-card border border-border rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-foreground mb-4">Checklist</h3>
                <div className="space-y-3">
                  {currentStepData.checklist.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        checklistStatus[index]
                          ? "border-primary/30 bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => handleChecklistToggle(index)}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        checklistStatus[index]
                          ? "bg-primary text-primary-foreground"
                          : "border-2 border-muted-foreground/30"
                      }`}>
                        {checklistStatus[index] && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <span className={`text-sm ${
                        checklistStatus[index] ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-foreground mb-4">Notes</h3>
                <Textarea
                  placeholder="Add your notes, account numbers, or reminders here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Resources Panel */}
              <div className="bg-card border border-border rounded-xl mt-4 overflow-hidden">
                <button
                  onClick={() => setShowResources(!showResources)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Resources</h3>
                  </div>
                  {showResources ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showResources && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-2">
                        {currentStepData.resources.map((resource, index) => {
                          const hasAccess = tierMeetsRequirement(userTier, resource.tier);
                          return (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                hasAccess
                                  ? "border-border hover:border-primary/30 cursor-pointer"
                                  : "border-border/50 bg-muted/30"
                              }`}
                            >
                              <span className={`text-sm ${
                                hasAccess ? "text-foreground" : "text-muted-foreground"
                              }`}>
                                {resource.title}
                              </span>
                              {hasAccess ? (
                                <ArrowRight className="h-4 w-4 text-primary" />
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Lock className="h-3 w-3" />
                                  <span className="capitalize">{resource.tier}+</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                    disabled={currentStep === STEPS.length - 1}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Progress"}
                  </Button>
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isSaving || progress[currentStepData.id]?.completed}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
