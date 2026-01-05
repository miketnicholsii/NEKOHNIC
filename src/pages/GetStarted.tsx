import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
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
import { 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  TrendingUp,
  Mail,
  Send
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

export default function GetStarted() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    stage: "",
    goal: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Welcome to NEKO!",
      description: "We'll be in touch soon to help you get started.",
    });
    
    setFormData({
      name: "",
      email: "",
      businessName: "",
      stage: "",
      goal: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
              Get Started
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tightest text-foreground mb-6">
              Let's begin your journey.
            </h1>
            <p className="text-xl text-muted-foreground">
              Tell us a bit about yourself and where you are in your business journey. 
              We'll help you find the right path forward.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="h-12"
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
                      className="h-12"
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
                    className="h-12"
                  />
                </div>

                {/* Stage */}
                <div className="space-y-2">
                  <Label>Where are you in your journey?</Label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {journeyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, stage: option.value })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.stage === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <option.icon className={`h-5 w-5 mb-2 ${
                          formData.stage === option.value ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <p className={`text-sm font-medium ${
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
                    <SelectTrigger className="h-12">
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
                    "Submitting..."
                  ) : (
                    <>
                      Start Your Journey
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Benefits */}
            <div className="lg:pl-8">
              <div className="sticky top-28">
                <div className="p-8 rounded-2xl bg-muted/50 border border-border">
                  <h3 className="font-display font-bold text-xl mb-6">What happens next?</h3>
                  
                  <div className="space-y-6">
                    {[
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
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 p-6 rounded-xl bg-card border border-border">
                  <p className="text-sm font-medium text-foreground mb-4">What you can expect:</p>
                  <ul className="space-y-3">
                    {[
                      "Clear, structured guidance",
                      "No hype or false promises",
                      "Progress you can track",
                      "Support when you need it",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact alternative */}
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Prefer to reach out directly?
                  </p>
                  <a
                    href="mailto:hello@helloneko.co"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    hello@helloneko.co
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
