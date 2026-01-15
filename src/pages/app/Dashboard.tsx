import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "@/components/dashboard/TaskManager";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import WidgetGrid from "@/components/dashboard/WidgetGrid";
import { AdminPreviewPanel } from "@/components/admin/AdminPreviewPanel";
import { AnnouncementsBanner } from "@/components/dashboard/AnnouncementsBanner";
import {
  ArrowRight,
  Crown,
  LayoutGrid,
  ListChecks,
  BookOpen,
  BarChart3,
  Gift,
  Sparkles,
  X,
} from "lucide-react";

const STRATEGY_BANNER_DISMISSED_KEY = "neko-strategy-banner-dismissed";

export default function Dashboard() {
  const { refreshSubscription, isAdmin } = useAuth();
  const { tier, isPreviewMode } = useSubscriptionTier();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isStrategyBannerDismissed, setIsStrategyBannerDismissed] = useState(() => {
    return localStorage.getItem(STRATEGY_BANNER_DISMISSED_KEY) === "true";
  });

  const handleDismissStrategyBanner = () => {
    setIsStrategyBannerDismissed(true);
    localStorage.setItem(STRATEGY_BANNER_DISMISSED_KEY, "true");
  };

  // Check for checkout success
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({
        title: "Welcome to your new plan!",
        description: "Your subscription has been activated.",
      });
      refreshSubscription();
    }
  }, [searchParams, toast, refreshSubscription]);

  return (
    <div className="space-y-6" role="main" aria-label="Dashboard">
      {/* Admin Preview Panel */}
      {isAdmin && <AdminPreviewPanel />}

      {/* Announcements Banner */}
      <AnnouncementsBanner />

      {/* Featured Strategy Banner */}
      {!isStrategyBannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Dismiss button */}
          <button
            onClick={handleDismissStrategyBanner}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="relative p-6 sm:p-8 pr-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
              <Gift className="h-6 w-6" aria-hidden="true" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  New
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                The Art of Generous First Impressions
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn how to build trust and credibility by leading with value—a calm, strategic approach to creating offers that open doors.
              </p>
            </div>
            
            <Link to="/app/resources?category=strategy" className="flex-shrink-0 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto group">
                Explore Strategy
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Personalized Welcome Header */}
      <WelcomeHeader />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl" role="tablist">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            aria-label="Overview tab"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            aria-label="Tasks tab"
          >
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            aria-label="Resources tab"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Resources</span>
          </TabsTrigger>
          <Link to="/app/analytics" className="inline-flex">
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              role="link"
              aria-label="Go to Analytics"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span>Analytics</span>
            </div>
          </Link>
        </TabsList>

        {/* Overview Tab - Customizable Widget Grid */}
        <TabsContent value="overview" className="mt-0" role="tabpanel" aria-label="Overview panel">
          <WidgetGrid />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-0" role="tabpanel" aria-label="Tasks panel">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TaskManager />
          </motion.div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-0" role="tabpanel" aria-label="Resources panel">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Learn at Your Pace</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "LLC Formation Guide",
                    category: "Business Setup",
                    readTime: "5 min read",
                  },
                  {
                    title: "Understanding Business Credit",
                    category: "Credit Building",
                    readTime: "6 min read",
                  },
                  {
                    title: "Net-30 Vendor Strategies",
                    category: "Credit Building",
                    readTime: "8 min read",
                  },
                  {
                    title: "Building Your Brand Online",
                    category: "Personal Brand",
                    readTime: "7 min read",
                  },
                ].map((resource) => (
                  <Link
                    key={resource.title}
                    to="/app/resources"
                    className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label={`${resource.title} - ${resource.category} - ${resource.readTime}`}
                  >
                    <p className="text-xs text-primary font-medium mb-1">
                      {resource.category}
                    </p>
                    <h3 className="font-medium text-foreground mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {resource.readTime}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/app/resources">
                  <Button variant="outline">
                    View All Resources
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA for free users */}
      {tier === "free" && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-border text-center"
          aria-label="Upgrade prompt"
        >
          <Crown className="h-8 w-8 text-primary mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            Ready for more?
          </h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            When you're ready to grow, our premium plans give you the complete credit roadmap, vendor guidance, and expanded personal brand tools.
          </p>
          <Link to="/pricing">
            <Button variant="cta">
              View Plans
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </motion.section>
      )}
    </div>
  );
}
