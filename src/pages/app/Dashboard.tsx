import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductOverview from "@/components/dashboard/ProductOverview";
import NextSteps from "@/components/dashboard/NextSteps";
import TaskManager from "@/components/dashboard/TaskManager";
import TrelloIntegration from "@/components/dashboard/TrelloIntegration";
import {
  ArrowRight,
  Crown,
  LayoutGrid,
  ListChecks,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const { user, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Check for checkout success
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({
        title: "Welcome to your new plan!",
        description: "Your subscription has been activated.",
      });
      // Refresh subscription status
      refreshSubscription();
    }
  }, [searchParams, toast, refreshSubscription]);

  const tierConfig = SUBSCRIPTION_TIERS[subscription.tier];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Your journey to a legitimate, credit-worthy business continues here.
          </p>
        </div>
        
        {/* Subscription Badge */}
        {subscription.tier !== "free" && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {tierConfig.name} Plan
              </p>
              {subscription.subscriptionEnd && (
                <p className="text-xs text-muted-foreground">
                  Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link to="/app/account">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2 py-3 data-[state=active]:bg-background">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              <ProductOverview />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <NextSteps />
              <TrelloIntegration />
            </div>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TaskManager />
          </motion.div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Learning Resources</h2>
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
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
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
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA for free users */}
      {subscription.tier === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-muted/50 border border-border text-center"
        >
          <Crown className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            Unlock Your Full Potential
          </h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Upgrade to access the full credit roadmap, vendor guidance, and expanded personal brand tools.
          </p>
          <Link to="/pricing">
            <Button variant="cta">
              View Plans
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
