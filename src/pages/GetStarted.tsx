import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection } from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  Building2, 
  User, 
  TrendingUp,
  Mail,
  Send,
  Loader2
} from "lucide-react";

const journeyOptions = [
  { value: "starting", label: "Just starting out", icon: Building2 },
  { value: "building", label: "Building my business", icon: User },
  { value: "scaling", label: "Ready to scale", icon: TrendingUp },
];

const goalOptions = [
  "Form my LLC properly",
  "Get my EIN",
  "Build business credit",
  "Create my personal brand",
  "Build a web presence",
  "All of the above",
];

const nextSteps = [
  {
    step: "1",
    title: "We review your submission",
    description: "Our team reviews your goals and current stage to understand how we can help.",
  },
  {
    step: "2",
    title: "You get access",
    description: "We'll send you login details and a personalized onboarding guide.",
  },
  {
    step: "3",
    title: "Start your journey",
    description: "Begin with the business starter flow or jump to where you are in your journey.",
  },
];

const expectations = [
  "Clear, structured guidance",
  "No hype or false promises",
  "Progress you can track",
  "Support when you need it",
];

export default function GetStarted() {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    stage: "",
    goal: "",
    message: "",
    // Honeypot field - hidden from users, bots will fill it
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    
    if (!name || name.length < 2) {
      toast({
        title: "Please enter your name",
        description: "Name must be at least 2 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Please enter a valid email",
        description: "We need a valid email to get in touch.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("contact-submit", {
        body: {
          name,
          email,
          businessName: formData.businessName.trim(),
          stage: formData.stage,
          goal: formData.goal,
          message: formData.message.trim(),
          website: formData.website, // Honeypot
        },
      });

      if (error) {
        console.error("Submission error:", error);
        toast({
          title: "Something went wrong",
          description: "Please try again or email us directly at hello@helloneko.co",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Submission failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
    
      toast({
        title: "Welcome to NEKO!",
        description: data?.message || "We'll be in touch soon to help you get started.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        businessName: "",
        stage: "",
        goal: "",
        message: "",
        website: "",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Easing as tuple for type compatibility
  const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
  const fadeIn = prefersReducedMotion 
    ? {} 
    : { 
        initial: { opacity: 0, y: 16 }, 
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOut }
      };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-8 sm:pb-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-3 sm:mb-4">
              Get Started
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tightest text-foreground mb-4 sm:mb-6 text-balance">
              Let's begin your journey.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Tell us a bit about yourself and where you are in your business journey. 
              We'll help you find the right path forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20">
            {/* Form */}
            <AnimatedSection direction="left">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Honeypot field - hidden from humans */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="h-11 sm:h-12"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="h-11 sm:h-12"
                      maxLength={255}
                      required
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name (if you have one)</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="ACME LLC"
                    className="h-11 sm:h-12"
                    maxLength={200}
                  />
                </div>

                {/* Stage */}
                <div className="space-y-2">
                  <Label>Where are you in your journey?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {journeyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, stage: option.value })}
                        className={`p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          formData.stage === option.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                        }`}
                      >
                        <option.icon className={`h-4 w-4 sm:h-5 sm:w-5 mb-2 ${
                          formData.stage === option.value ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <p className={`text-xs sm:text-sm font-medium ${
                          formData.stage === option.value ? "text-primary" : "text-foreground"
                        }`}>
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                  <Label htmlFor="goal">What's your primary goal?</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => setFormData({ ...formData, goal: value })}
                  >
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="Select your main goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Anything else you'd like to share?</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your business idea or goals..."
                    rows={4}
                    className="resize-none"
                    maxLength={2000}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="cta"
                  size="xl"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Start Your Journey
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </AnimatedSection>

            {/* Benefits */}
            <AnimatedSection direction="right" delay={0.15} className="lg:pl-8">
              <div className="sticky top-28 space-y-5 sm:space-y-6">
                <div className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-muted/50 border border-border">
                  <h3 className="font-display font-bold text-lg sm:text-xl mb-5 sm:mb-6">What happens next?</h3>
                  
                  <div className="space-y-5 sm:space-y-6">
                    {nextSteps.map((item) => (
                      <div key={item.step} className="flex gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm sm:text-base text-foreground mb-1">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="p-4 sm:p-5 lg:p-6 rounded-xl bg-card border border-border">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4">What you can expect:</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {expectations.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact alternative */}
                <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Prefer to reach out directly?
                  </p>
                  <a
                    href="mailto:hello@helloneko.co"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    hello@helloneko.co
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
