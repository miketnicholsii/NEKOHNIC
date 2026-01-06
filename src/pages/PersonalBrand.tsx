import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
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
  Layout,
  Sparkles,
  CheckCircle2,
  Globe,
  Mail
} from "lucide-react";

const brandElements = [
  {
    icon: User,
    title: "Your Story",
    description: "Tell your journey — where you've been, what you've learned, and where you're going.",
  },
  {
    icon: Briefcase,
    title: "Your Skills",
    description: "Showcase what you bring to the table — your expertise, experience, and unique abilities.",
  },
  {
    icon: FileText,
    title: "Your Goals",
    description: "Share your vision — what you're building and the impact you want to make.",
  },
  {
    icon: Link2,
    title: "Your Links",
    description: "Connect your work — portfolio, projects, social profiles, and contact information.",
  },
];

const presencePages = [
  {
    icon: Layout,
    title: "Landing Page",
    description: "First impressions matter. A clear, compelling introduction to who you are and what you offer.",
    template: true,
  },
  {
    icon: User,
    title: "About Page",
    description: "Your story in depth. Background, journey, values, and what drives you forward.",
    template: true,
  },
  {
    icon: Briefcase,
    title: "Services Page",
    description: "What you offer. Clear descriptions of your services, process, and how to work with you.",
    template: true,
  },
  {
    icon: Mail,
    title: "Contact Page",
    description: "Make it easy. Clear calls-to-action and simple ways for people to reach you.",
    template: true,
  },
];

const benefits = [
  "Stand out to clients, partners, and opportunities",
  "Control your narrative — tell your story your way",
  "Create a professional first impression online",
  "Connect all your work and profiles in one place",
  "Build long-term credibility as you grow",
];

export default function PersonalBrand() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4">
              Personal Brand
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest text-foreground mb-6">
              Your Digital CV.
              <br />
              <span className="text-muted-foreground">Your Story. Your Brand.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Create a professional personal brand page that showcases your story, work, and credibility — designed to open doors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is a Digital CV */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <AnimatedSection direction="left">
              <SectionHeading
                label="What is a Digital CV?"
                title="More than a resume. A professional brand artifact."
                description="Your Digital CV is a visually appealing, shareable page that tells your story, showcases your skills, and connects people to your work."
              />

              <div className="mt-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  This isn't a social network or a generic portfolio template. It's an intentional, modern representation of who you are professionally — designed to build credibility and open doors.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're a freelancer pitching clients, a founder seeking partners, or a creator building an audience — your Digital CV is your professional home base.
                </p>
              </div>

              <div className="mt-8">
                <Link to="/signup">
                  <Button variant="cta" size="lg" className="group">
                    Create Yours
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Preview Card */}
          </div>
        </div>
      </section>

      {/* Brand Elements */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="What's Included"
              title="Everything your brand needs."
              description="Your Digital CV brings together the essential elements of a professional personal brand."
              centered
              className="mb-16"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandElements.map((element) => (
              <motion.div
                key={element.title}
                variants={staggerItem}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 mx-auto">
                  <element.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{element.title}</h3>
                <p className="text-sm text-muted-foreground">{element.description}</p>
              </motion.div>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Web Presence Guide */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              label="Web Presence"
              title="Structure for your digital home."
              description="Beyond your Digital CV, NÈKO provides guidance and templates for building a complete web presence."
              className="mb-12"
            />
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {presencePages.map((page) => (
              <motion.div
                key={page.title}
                variants={staggerItem}
                className="p-6 rounded-2xl bg-card border border-border flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <page.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-foreground">{page.title}</h3>
                    {page.template && (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        Template
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatedStagger>

          <AnimatedSection delay={0.3} className="mt-10">
            <div className="p-6 rounded-2xl bg-card border border-border max-w-4xl">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-2">Structure, Not CMS</p>
                  <p className="text-muted-foreground leading-relaxed">
                    NÈKO provides structure, templates, and educational guidance for your web presence — not a full content management system. We help you understand what you need and how to build it.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <SectionHeading
                label="Why Build Your Brand?"
                title="Credibility opens doors."
                centered
                className="mb-10"
              />
            </AnimatedSection>

            <AnimatedStagger className="grid gap-4">
              {benefits.map((benefit) => (
                <motion.div 
                  key={benefit} 
                  variants={staggerItem}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 text-left"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </AnimatedStagger>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-tertiary">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <SectionHeading
              label="Ready to Build?"
              title="Create your Digital CV today."
              description="Start with our templates and build a professional personal brand that grows with you."
              centered
              light
              className="mb-10"
            />
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
