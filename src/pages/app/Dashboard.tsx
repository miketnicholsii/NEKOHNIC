import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  CreditCard,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";

const journeyModules = [
  {
    id: "business-starter",
    title: "Start Your Business",
    description: "Form your LLC, get your EIN, and establish legitimacy",
    icon: Building2,
    href: "/app/business-starter",
    progress: 0,
    total: 5,
    status: "not-started" as const,
  },
  {
    id: "business-credit",
    title: "Build Business Credit",
    description: "Progress through credit tiers with strategic vendor accounts",
    icon: CreditCard,
    href: "/app/business-credit",
    progress: 0,
    total: 4,
    status: "locked" as const,
  },
  {
    id: "personal-brand",
    title: "Build Your Brand",
    description: "Create your personal brand and digital presence",
    icon: User,
    href: "/app/personal-brand",
    progress: 0,
    total: 6,
    status: "locked" as const,
  },
];

const spotlightResources = [
  {
    title: "LLC Formation Guide",
    category: "Business Setup",
    readTime: "5 min read",
  },
  {
    title: "Understanding Business Credit",
    category: "Credit Building",
    readTime: "8 min read",
  },
];

export default function Dashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Clock className="h-3 w-3" />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            Locked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome to NÈKO
        </h1>
        <p className="text-muted-foreground">
          Your journey to a legitimate, credit-worthy business starts here.
        </p>
      </motion.div>

      {/* Next Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold mb-1">
                Start with the basics
              </h2>
              <p className="text-primary-foreground/80 text-sm">
                Begin by establishing your business foundation — it only takes a few steps.
              </p>
            </div>
          </div>
          <Link to="/app/business-starter">
            <Button variant="hero" className="w-full sm:w-auto group">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Journey Modules */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Your Journey
        </h2>
        <div className="grid gap-4">
          {journeyModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={module.status !== "locked" ? module.href : "#"}
                className={`block p-5 rounded-xl border transition-all ${
                  module.status === "locked"
                    ? "bg-muted/30 border-border cursor-not-allowed opacity-60"
                    : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    module.status === "locked"
                      ? "bg-muted"
                      : "bg-primary/10"
                  }`}>
                    <module.icon className={`h-6 w-6 ${
                      module.status === "locked"
                        ? "text-muted-foreground"
                        : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {module.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      {getStatusBadge(module.status)}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{module.progress} of {module.total} completed</span>
                        <span>{Math.round((module.progress / module.total) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(module.progress / module.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resources Spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Resources for You
          </h2>
          <Link to="/app/resources" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {spotlightResources.map((resource) => (
            <div
              key={resource.title}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">
                    {resource.category}
                  </p>
                  <h3 className="font-medium text-foreground mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {resource.readTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
