import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MapPin, Clock, Send, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

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

// Floating orb component for background animation
function FloatingOrbs() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
        style={{ top: "-10%", right: "-10%" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl"
        style={{ bottom: "10%", left: "-5%" }}
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      {/* Accent orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-primary/3 blur-2xl"
        style={{ top: "40%", left: "30%" }}
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
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

  const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <FloatingOrbs />
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tightest text-foreground mb-6">
              Let's talk
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Questions, ideas, or ready to start? We'd genuinely love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Form - takes 3 columns */}
              <motion.div 
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
                className="lg:col-span-3"
              >
                {isSuccess ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-card border border-border shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                      Message sent
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
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
                  <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-card border border-border shadow-sm">
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

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                            maxLength={100}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                            maxLength={255}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interest" className="text-sm font-medium">What are you interested in?</Label>
                        <Select
                          value={formData.interest}
                          onValueChange={(value) => setFormData({ ...formData, interest: value })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors">
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
                        <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your goals or questions"
                          rows={5}
                          className="resize-none rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                          maxLength={2000}
                          required
                        />
                      </div>

                      <div className="flex justify-center pt-2">
                        <TurnstileWidget
                          ref={turnstileRef}
                          onVerify={handleTurnstileVerify}
                          onExpire={handleTurnstileExpire}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base group"
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
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>

              {/* Contact Info - takes 2 columns */}
              <motion.div 
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="sticky top-28 space-y-6">
                  {/* Contact cards */}
                  <div className="space-y-4">
                    {contactInfo.map((item, index) => (
                      <motion.div 
                        key={item.label}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: easeOut, delay: 0.3 + index * 0.1 }}
                        className="p-5 rounded-2xl bg-white dark:bg-card border border-border shadow-sm flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-base font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-base font-medium text-foreground">{item.value}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Member login card */}
                  <motion.div 
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: easeOut, delay: 0.6 }}
                    className="p-6 rounded-2xl bg-slate-900 text-white"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Already a member?
                    </h3>
                    <p className="text-sm text-slate-400 mb-5">
                      Log in to access your dashboard and continue your journey.
                    </p>
                    <Button asChild variant="secondary" className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100">
                      <a href="/login">Member Login</a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
