import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Building2, Target, MapPin } from "lucide-react";

const BUSINESS_STAGES = [
  { value: "idea", label: "Just an idea", description: "Exploring concepts" },
  { value: "formed", label: "Just formed", description: "LLC/EIN in progress or done" },
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
  { id: 1, title: "Business Stage", icon: Building2 },
  { id: 2, title: "Industry & Location", icon: MapPin },
  { id: 3, title: "Your Goals", icon: Target },
  { id: 4, title: "Current Status", icon: CheckCircle2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-1 w-8 sm:w-12 mx-1 transition-all ${
                    step > s.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 4: {STEPS[step - 1].title}
        </p>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Welcome to NÈKO
                  </h1>
                  <p className="text-muted-foreground">
                    Let's personalize your journey. Where are you in your business?
                  </p>
                </div>
                <RadioGroup
                  value={formData.businessStage}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, businessStage: value }))}
                  className="space-y-3"
                >
                  {BUSINESS_STAGES.map((stage) => (
                    <div
                      key={stage.value}
                      className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.businessStage === stage.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, businessStage: stage.value }))}
                    >
                      <RadioGroupItem value={stage.value} id={stage.value} />
                      <div className="flex-1">
                        <Label htmlFor={stage.value} className="font-medium cursor-pointer">
                          {stage.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    Tell us more about your business
                  </h2>
                  <p className="text-muted-foreground">
                    This helps us tailor your experience
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full mt-1.5 h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full mt-1.5 h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    >
                      <option value="">Select your state</option>
                      {US_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name (optional)</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Your business name"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    What are your goals?
                  </h2>
                  <p className="text-muted-foreground">
                    Select all that apply
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {GOALS.map((goal) => (
                    <div
                      key={goal.id}
                      className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        formData.goals.includes(goal.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <Checkbox
                        id={goal.id}
                        checked={formData.goals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <Label htmlFor={goal.id} className="font-medium cursor-pointer flex-1">
                        {goal.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    Current business status
                  </h2>
                  <p className="text-muted-foreground">
                    This helps us customize your checklist
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      formData.hasLLC
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, hasLLC: !prev.hasLLC }))}
                  >
                    <Checkbox
                      id="hasLLC"
                      checked={formData.hasLLC}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasLLC: !!checked }))}
                    />
                    <div className="flex-1">
                      <Label htmlFor="hasLLC" className="font-medium cursor-pointer">
                        I already have an LLC
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Or another registered business entity
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      formData.hasEIN
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, hasEIN: !prev.hasEIN }))}
                  >
                    <Checkbox
                      id="hasEIN"
                      checked={formData.hasEIN}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasEIN: !!checked }))}
                    />
                    <div className="flex-1">
                      <Label htmlFor="hasEIN" className="font-medium cursor-pointer">
                        I already have an EIN
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Employer Identification Number from the IRS
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground">
                    <strong>You're all set!</strong> Based on your answers, we'll create a personalized dashboard with next steps to help you achieve your goals.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isSubmitting}
                className="gap-2"
              >
                {step === 4 ? (isSubmitting ? "Saving..." : "Get Started") : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
