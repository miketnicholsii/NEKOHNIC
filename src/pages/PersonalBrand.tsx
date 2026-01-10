import { memo } from "react";
import { motion } from "framer-motion";
import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedStagger, staggerItem } from "@/components/AnimatedSection";
import { 
  ArrowRight, 
  User, 
  Briefcase, 
  Link2, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Building2,
  Globe,
  TrendingUp
} from "lucide-react";

const brandElements = [
  {
    icon: User,
    title: "Your Story",
    description: "Where you've been, what you've learned, where you're going.",
  },
  {
    icon: Briefcase,
    title: "Your Skills",
    description: "What you bring to the table — expertise, experience, ability.",
  },
  {
    icon: FileText,
    title: "Your Goals",
    description: "What you're building and the impact you want to make.",
  },
  {
    icon: Link2,
    title: "Your Links",
    description: "Portfolio, projects, profiles — everything in one place.",
  },
];

const standaloneBenefits = [
  "Establish credibility as a professional",
  "Control your narrative online",
  "Create a memorable first impression",
  "Consolidate your work in one shareable link",
  "Stand out to clients and opportunities",
];

const businessBenefits = [
  "Build trust as the face behind your company",
  "Humanize your brand with founder credibility",
  "Connect personal expertise to business offerings",
  "Amplify reach with two connected presences",
  "Attract partnerships and collaborations",
];

const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/4 left-[15%] w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary-foreground/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/3 right-[10%] w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-primary-foreground/5 rounded-full blur-3xl opacity-50" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] border border-primary-foreground/10 rounded-full" />
    </div>
  );
});

const CheckItem = memo(function CheckItem({ item }: { item: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-sm text-foreground">{item}</span>
    </li>
  );
});

export default function PersonalBrand() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <EccentricNavbar />

      {/* Hero */}
      <section className="relative min-h-[70svh] flex items-center justify-center bg-gradient-hero overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-hero-radial pointer-events-none" aria-hidden="true" />
        <HeroBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/70 text-xs font-semibold mb-6"
            >
              <User className="h-3.5 w-3.5" />
              Personal Branding Track
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-primary-foreground mb-6"
            >
              Your Digital CV.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              A professional presence that tells your story, showcases your work, and helps people understand who you are — all in one place.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link to="/contact">
                <Button variant="hero" size="lg" className="group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="lg">
                  View Plans
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is a Digital CV */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                What is a Digital CV?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                More than a resume. More than a link.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Your Digital CV is a shareable page that tells your story, showcases your skills, and connects people to your work — all in one professional destination.
                </p>
                <p>
                  Not a social network. Not a generic template. An intentional representation of who you are professionally.
                </p>
              </div>

              <div className="mt-6">
                <Link to="/contact">
                  <Button variant="cta" size="lg" className="group">
                    Build Your Digital CV
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-md">
                <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  What's Included
                </h3>
                <div className="grid gap-4">
                  {brandElements.map((element, index) => (
                    <div key={element.title} className="flex items-start gap-3 group">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        index === 0 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        <element.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm transition-colors duration-200 group-hover:text-primary">{element.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{element.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Two Ways to Use - The Key Connection */}
      <section className="py-16 sm:py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-primary mb-3">
                How It Works
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Standalone or supporting.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your personal brand can work independently, or it can complement and amplify your business. Choose the path that fits your goals.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Standalone Path */}
            <motion.div variants={staggerItem}>
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">Standalone</h3>
                    <p className="text-sm text-muted-foreground">Your professional identity</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  For freelancers, consultants, creators, and professionals who want to establish their own credibility and presence — independent of any company.
                </p>
                
                <ul className="space-y-2.5">
                  {standaloneBenefits.map((benefit) => (
                    <CheckItem key={benefit} item={benefit} />
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Supporting Business Path */}
            <motion.div variants={staggerItem}>
              <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-md h-full relative">
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                    For Founders
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">Supporting Business</h3>
                    <p className="text-sm text-muted-foreground">Amplify your company</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  For founders and business owners who want their personal credibility to reinforce and amplify their company's brand.
                </p>
                
                <ul className="space-y-2.5">
                  {businessBenefits.map((benefit) => (
                    <CheckItem key={benefit} item={benefit} />
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatedStagger>

          {/* Connection Note */}
          <AnimatedSection delay={0.2}>
            <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-card border border-border max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Part of the NÈKO ecosystem</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Personal Branding is one of two tracks at NÈKO. If you're also building a business, our <Link to="/services" className="text-primary hover:underline">Business Enablement track</Link> helps with formation, banking, and credit building. Use them together or separately.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Why It Matters"
              title="Credibility opens doors."
              description="In a world where everyone is online, the question isn't whether people will look you up — it's what they'll find when they do."
              centered
              className="mb-10 sm:mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, title: "Career Advancement", description: "Stand out to recruiters, clients, and collaborators with a polished professional presence." },
              { icon: Globe, title: "Online Discoverability", description: "Be found when people search for your expertise. SEO-optimized for your name and skills." },
              { icon: Link2, title: "Consolidated Presence", description: "One link that connects to everything — portfolio, social profiles, projects, and contact." },
            ].map((item) => (
              <motion.div 
                key={item.title}
                variants={staggerItem}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/40 mb-4">
              Ready to Begin?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
              Your presence is waiting.
            </h2>
            <p className="text-lg text-primary-foreground/60 mb-10 max-w-md mx-auto">
              Let's create something that represents the real you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/contact">
                <Button variant="hero" size="xl" className="group">
                  Say Hello
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero-outline" size="xl">
                  View Plans
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
