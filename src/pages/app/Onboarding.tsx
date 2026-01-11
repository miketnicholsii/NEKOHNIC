import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAuth } from "@/hooks/use-auth";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Building2, Target, MapPin, Loader2 } from "lucide-react";

const BUSINESS_STAGES = [
  { value: "idea", label: "Just an idea", description: "I'm exploring concepts" },
  { value: "formed", label: "Just formed", description: "LLC or EIN in progress" },
  { value: "operating", label: "Operating", description: "Already generating revenue" },
];

const INDUSTRIES = [
  "Consulting / Coaching",
  "E-commerce / Retail",
  "Real Estate",
  "Technology / Software",
  "Healthcare / Wellness",
  "Food & Beverage",
  "Creative / Media",
  "Construction / Trades",
  "Financial Services",
  "Other",
];

const GOALS = [
  { id: "form_llc", label: "Form my LLC" },
  { id: "get_ein", label: "Get my EIN" },
  { id: "build_credit", label: "Build business credit" },
  { id: "personal_brand", label: "Build personal brand" },
  { id: "get_funding", label: "Access funding" },
  { id: "grow_revenue", label: "Grow revenue" },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const STEPS = [
  { id: 1, title: "Stage", icon: Building2, fullTitle: "Business Stage" },
  { id: 2, title: "Details", icon: MapPin, fullTitle: "Industry & Location" },
  { id: 3, title: "Goals", icon: Target, fullTitle: "Your Goals" },
  { id: 4, title: "Status", icon: CheckCircle2, fullTitle: "Current Status" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const industryId = useId();
  const stateId = useId();
  const businessNameId = useId();
  
  const [formData, setFormData] = useState({
    businessStage: "",
    industry: "",
    state: "",
    goals: [] as string[],
    hasLLC: false,
    hasEIN: false,
    businessName: "",
  });

  // Redirect if already onboarded
  useEffect(() => {
    if (profile?.onboarding_completed) {
      navigate("/app");
    }
  }, [profile, navigate]);

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.businessStage;
      case 2: return !!formData.industry && !!formData.state;
      case 3: return formData.goals.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          business_stage: formData.businessStage,
          industry: formData.industry,
          state: formData.state,
          has_llc: formData.hasLLC,
          has_ein: formData.hasEIN,
          business_name: formData.businessName || null,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Save goals to progress table
      const goalProgress = formData.goals.map(goal => ({
        user_id: user.id,
        module: "onboarding",
        step: goal,
        completed: false,
        metadata: { selected_at: new Date().toISOString() }
      }));

      if (goalProgress.length > 0) {
        await supabase.from("progress").insert(goalProgress);
      }

      await refreshProfile();
      toast.success("Welcome to NÈKO! Let's get started.");
      navigate("/app");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Animation variants with reduced motion support
  const contentVariants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
      };

  const transitionConfig = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-6 sm:py-8">
      {/* Progress Indicator - Compact */}
      <div className="w-full max-w-md mb-6" role="navigation" aria-label="Onboarding progress">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => step > s.id && setStep(s.id)}
                disabled={step < s.id}
                aria-label={`Step ${s.id}: ${s.fullTitle}${step === s.id ? " (current)" : ""}`}
                aria-current={step === s.id ? "step" : undefined}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                } ${step > s.id ? "cursor-pointer hover:bg-primary/90" : ""} ${
                  step < s.id ? "cursor-not-allowed" : ""
                }`}
              >
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-10 mx-1 transition-colors ${
                    step > s.id ? "bg-primary" : "bg-muted"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center" aria-live="polite">
          Step {step} of 4 — {STEPS[step - 1].fullTitle}
        </p>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg">
        <motion.div
          key={step}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionConfig}
          className="bg-card border border-border rounded-2xl p-5 sm:p-7 shadow-lg"
        >
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Welcome to NÈKO
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A few quick questions so we can guide you well.
                </p>
              </div>
              <RadioGroup
                value={formData.businessStage}
                onValueChange={(value) => setFormData(prev => ({ ...prev, businessStage: value }))}
                className="space-y-2.5"
                aria-label="Select your business stage"
              >
                {BUSINESS_STAGES.map((stage) => (
                  <label
                    key={stage.value}
                    htmlFor={stage.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.businessStage === stage.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <RadioGroupItem value={stage.value} id={stage.value} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground block">
                        {stage.label}
                      </span>
                      <span className="text-sm text-muted-foreground">{stage.description}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  A bit more about you
                </h2>
                <p className="text-muted-foreground text-sm">
                  This helps us personalize your experience
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={industryId}>Industry</Label>
                  <SearchableSelect
                    id={industryId}
                    value={formData.industry}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                    options={INDUSTRIES}
                    placeholder="Select your industry"
                    searchPlaceholder="Search industries..."
                    emptyMessage="No matching industries"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={stateId}>State</Label>
                  <SearchableSelect
                    id={stateId}
                    value={formData.state}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                    options={US_STATES}
                    placeholder="Select your state"
                    searchPlaceholder="Type to search states..."
                    emptyMessage="No matching states"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={businessNameId}>
                    Business name <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id={businessNameId}
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your business name"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  What would you like to accomplish?
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select everything that applies
                </p>
              </div>
              
              <div 
                className="grid gap-2.5"
                role="group"
                aria-label="Select your goals"
              >
                {GOALS.map((goal) => (
                  <label
                    key={goal.id}
                    htmlFor={goal.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.goals.includes(goal.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={goal.id}
                      checked={formData.goals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <span className="font-medium text-foreground flex-1">
                      {goal.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  What have you already done?
                </h2>
                <p className="text-muted-foreground text-sm">
                  No worries if the answer is "nothing yet"
                </p>
              </div>
              
              <div className="space-y-3" role="group" aria-label="Current business status">
                <label
                  htmlFor="hasLLC"
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.hasLLC
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    id="hasLLC"
                    checked={formData.hasLLC}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasLLC: !!checked }))}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground block">
                      I already have an LLC
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Or another registered business entity
                    </span>
                  </div>
                </label>

                <label
                  htmlFor="hasEIN"
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.hasEIN
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    id="hasEIN"
                    checked={formData.hasEIN}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasEIN: !!checked }))}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground block">
                      I already have an EIN
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Employer Identification Number from the IRS
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground leading-relaxed">
                  <strong className="font-semibold">You're all set!</strong>{" "}
                  We'll build you a personalized dashboard with clear next steps.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
              aria-label="Go to previous step"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className="gap-2 min-w-[120px]"
              aria-label={step === 4 ? "Complete onboarding" : "Go to next step"}
            >
              {step === 4 ? (
                isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Get Started"
                )
              ) : (
                "Continue"
              )}
              {step < 4 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
