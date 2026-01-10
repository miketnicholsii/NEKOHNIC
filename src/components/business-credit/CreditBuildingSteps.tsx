import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Building2,
  CreditCard,
  Store,
  Landmark,
  TrendingUp,
  Save,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { tierMeetsRequirement, normalizeTier } from "@/lib/subscription-tiers";

interface StepData {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  checklist: string[];
  tips: string[];
  tier: string;
}

const CREDIT_STEPS: StepData[] = [
  {
    id: "duns_number",
    title: "Get Your D-U-N-S Number",
    icon: FileText,
    description: "Your D-U-N-S number is a unique 9-digit identifier for your business, required by most lenders and credit bureaus. It's free to obtain from Dun & Bradstreet.",
    checklist: [
      "Have your EIN and business formation documents ready",
      "Go to dnb.com and search for your business",
      "If not found, request a free D-U-N-S number",
      "Complete the application with accurate business info",
      "Wait 30 days for processing (or pay to expedite)",
      "Save your D-U-N-S number securely",
    ],
    tips: [
      "Use your exact legal business name",
      "Ensure your business address matches other records",
      "The free option takes 30 days; expedited is ~$229",
    ],
    tier: "free",
  },
  {
    id: "business_address",
    title: "Establish Business Address",
    icon: Building2,
    description: "A commercial business address (not a home address) adds credibility and is preferred by vendors and credit bureaus.",
    checklist: [
      "Consider a virtual office or coworking space",
      "Ensure the address can receive mail",
      "Update your address with the IRS if needed",
      "Update your LLC/business registration",
      "Use this address consistently on all applications",
    ],
    tips: [
      "Virtual offices typically cost $50-150/month",
      "Some UPS Store addresses work well",
      "Consistency across all records is crucial",
    ],
    tier: "free",
  },
  {
    id: "business_phone",
    title: "Dedicated Business Phone",
    icon: Building2,
    description: "A dedicated business phone line (not your personal cell) is required for most business credit applications and adds legitimacy.",
    checklist: [
      "Get a dedicated business phone number",
      "Set up professional voicemail greeting",
      "List the number in 411 directory",
      "Use VoIP for cost-effective options",
      "Answer calls professionally",
    ],
    tips: [
      "Google Voice is a free option",
      "Being listed in 411 helps verification",
      "Some vendors require a landline (VoIP works)",
    ],
    tier: "free",
  },
  {
    id: "net30_vendors",
    title: "Open Net-30 Vendor Accounts",
    icon: Store,
    description: "Net-30 vendors give you 30 days to pay invoices. Many report to business credit bureaus, helping you build credit history.",
    checklist: [
      "Start with easy-approval vendors (Uline, Grainger, Quill)",
      "Apply for 3-5 Net-30 accounts",
      "Make small purchases on each account",
      "Pay invoices early or on time",
      "Verify they report to D&B, Experian, or Equifax",
      "Track payment due dates carefully",
    ],
    tips: [
      "Uline, Grainger, and Quill are beginner-friendly",
      "Pay early to boost your PAYDEX score",
      "Aim for 5+ tradelines reporting",
    ],
    tier: "starter",
  },
  {
    id: "store_credit",
    title: "Get Store Credit Cards",
    icon: CreditCard,
    description: "Business store credit cards (Home Depot, Staples, etc.) are easier to get than bank cards and help build your credit profile.",
    checklist: [
      "Apply for Home Depot, Lowes, or Staples business cards",
      "Use cards for regular business purchases",
      "Keep utilization below 30%",
      "Pay statement balance in full each month",
      "Request credit limit increases after 6 months",
    ],
    tips: [
      "These often don't require personal guarantee",
      "Low limits initially are normal",
      "Good payment history leads to higher limits",
    ],
    tier: "starter",
  },
  {
    id: "business_credit_card",
    title: "Business Credit Cards",
    icon: Landmark,
    description: "Once you have tradelines and store cards, apply for traditional business credit cards to further strengthen your profile.",
    checklist: [
      "Wait until you have 5+ tradelines reporting",
      "Check your business credit scores first",
      "Apply for cards that match your score range",
      "Consider secured business cards if needed",
      "Use responsibly and pay on time",
    ],
    tips: [
      "Chase Ink, Amex Business, and Capital One Spark are popular",
      "Having 6+ months of history helps approval odds",
      "Start with cards for fair/building credit if needed",
    ],
    tier: "pro",
  },
  {
    id: "credit_monitoring",
    title: "Monitor & Maintain",
    icon: TrendingUp,
    description: "Regularly monitor your business credit scores and reports to catch errors and track progress.",
    checklist: [
      "Set up monitoring with Nav.com or CreditSignal",
      "Check D&B PAYDEX score monthly",
      "Review Experian Business report quarterly",
      "Dispute any errors promptly",
      "Keep all accounts in good standing",
    ],
    tips: [
      "Nav.com offers free basic monitoring",
      "A PAYDEX of 80+ is considered excellent",
      "Errors are common - check regularly",
    ],
    tier: "pro",
  },
];

interface Props {
  progress: Record<string, boolean>;
  setProgress: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  userId: string;
}

export default function CreditBuildingSteps({ progress, setProgress, userId }: Props) {
  const { subscription } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState("");
  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const userTier = normalizeTier(subscription?.tier);
  const currentStepData = CREDIT_STEPS[currentStep];
  const hasAccess = tierMeetsRequirement(userTier, currentStepData.tier);

  const handleChecklistToggle = (index: number) => {
    if (!hasAccess) return;
    setChecklistStatus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSave = async () => {
    if (!userId || !hasAccess) return;
    
    setIsSaving(true);
    try {
      const stepId = currentStepData.id;
      const allChecked = currentStepData.checklist.every((_, i) => checklistStatus[i]);
      
      const { error } = await supabase
        .from("progress")
        .upsert({
          user_id: userId,
          module: "business_credit",
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
        [stepId]: allChecked
      }));

      toast.success("Progress saved — keep it up!");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Couldn't save that. Try again?");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!userId || !hasAccess) return;
    
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
          user_id: userId,
          module: "business_credit",
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
        [stepId]: true
      }));

      toast.success("Nice work — step complete! 🎉");
      
      if (currentStep < CREDIT_STEPS.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 500);
      }
    } catch (error) {
      console.error("Error marking complete:", error);
      toast.error("Couldn't save that. Try again?");
    } finally {
      setIsSaving(false);
    }
  };

  const completedSteps = CREDIT_STEPS.filter(s => progress[s.id]).length;

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Step Navigation */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="mb-4">
          <h2 className="font-semibold text-foreground mb-2">Credit Building Steps</h2>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(completedSteps / CREDIT_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedSteps} of {CREDIT_STEPS.length} completed
          </p>
        </div>
        
        <nav className="space-y-2">
          {CREDIT_STEPS.map((step, index) => {
            const isCompleted = progress[step.id];
            const isCurrent = index === currentStep;
            const stepHasAccess = tierMeetsRequirement(userTier, step.tier);
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
                  {!stepHasAccess ? (
                    <Lock className="h-4 w-4" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-medium truncate ${
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
      <div className="space-y-4">
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
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {currentStepData.title}
                    </h2>
                    {!hasAccess && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {currentStepData.tier.charAt(0).toUpperCase() + currentStepData.tier.slice(1)}+
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {currentStepData.description}
                  </p>
                </div>
                {progress[currentStepData.id] && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Done
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className={`bg-card border border-border rounded-xl p-6 mt-4 ${!hasAccess ? 'opacity-60' : ''}`}>
              <h3 className="font-semibold text-foreground mb-4">Checklist</h3>
              <div className="space-y-3">
                {currentStepData.checklist.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      hasAccess ? 'cursor-pointer' : 'cursor-not-allowed'
                    } ${
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

            {/* Tips Panel */}
            <div className="bg-card border border-border rounded-xl mt-4 overflow-hidden">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Pro Tips</h3>
                </div>
                {showTips ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2">
                      {currentStepData.tips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <span className="text-primary font-bold">💡</span>
                          <span className="text-sm text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notes */}
            {hasAccess && (
              <div className="bg-card border border-border rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-foreground mb-4">Notes</h3>
                <Textarea
                  placeholder="Track your progress, save account numbers, or add reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}

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
                  onClick={() => setCurrentStep(Math.min(CREDIT_STEPS.length - 1, currentStep + 1))}
                  disabled={currentStep === CREDIT_STEPS.length - 1}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {hasAccess && (
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
                    disabled={isSaving || progress[currentStepData.id]}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
