import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection } from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "neko@helloneko.co",
    href: "mailto:neko@helloneko.co",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-first company",
    href: null,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

const interestOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "free", label: "Free Tier" },
  { value: "start", label: "Start Plan ($29/mo)" },
  { value: "build", label: "Build Plan ($79/mo)" },
  { value: "scale", label: "Scale Plan ($149/mo)" },
  { value: "partnership", label: "Partnership" },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
    website: "", // Honeypot
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const turnstileRef = useRef<{ reset: () => void } | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    
    if (!name || name.length < 2) {
      toast({
        title: "We'd love to know your name",
        variant: "destructive",
      });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "We need a valid email to respond",
        variant: "destructive",
      });
      return;
    }

    if (!message || message.length < 10) {
      toast({
        title: "Tell us a bit more",
        description: "A few more words would help us understand.",
        variant: "destructive",
      });
      return;
    }

    if (!turnstileToken) {
      toast({
        title: "One quick security check",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const interestLabel = interestOptions.find(o => o.value === formData.interest)?.label || "General Inquiry";
      
      const { data, error } = await supabase.functions.invoke("contact-submit", {
        body: {
          name,
          email,
          businessName: interestLabel,
          stage: "contact",
          goal: formData.interest || "general-inquiry",
          message,
          website: formData.website,
          turnstileToken,
        },
      });

      if (error || data?.error) {
        toast({
          title: "That didn't quite work",
          description: "Feel free to try again, or email us directly.",
          variant: "destructive",
        });
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      toast({
        title: "Something unexpected happened",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-8 sm:pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary-foreground/70 mb-3">
              Say Hello
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tightest text-primary-foreground mb-4">
              Let's talk
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Questions, ideas, or ready to start? We'd genuinely like to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <AnimatedSection direction="left">
              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-muted/50 border border-border text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Message sent
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        interest: "",
                        message: "",
                        website: "",
                      });
                      setTurnstileToken(null);
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot */}
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

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="h-12"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="h-12"
                        maxLength={255}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">What are you interested in?</Label>
                    <Select
                      value={formData.interest}
                      onValueChange={(value) => setFormData({ ...formData, interest: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {interestOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your goals or questions"
                      rows={5}
                      className="resize-none"
                      maxLength={2000}
                      required
                    />
                  </div>

                  <div className="flex justify-center">
                    <TurnstileWidget
                      ref={turnstileRef}
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileExpire}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full group"
                    disabled={isSubmitting || !turnstileToken}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection direction="right" delay={0.15} className="lg:pl-8">
              <div className="sticky top-28 space-y-6">
                <div className="p-6 lg:p-8 rounded-2xl bg-muted/50 border border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Contact information
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-medium text-foreground mb-2">
                    Already a member?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Log in to access your dashboard and continue your journey.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/login">Member Login</a>
                  </Button>
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
