import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase";
import {
  Search,
  BookOpen,
  Clock,
  Lock,
  ArrowRight,
  Gift,
  Sparkles,
  CreditCard,
  FileText,
  CheckSquare,
  User,
  FolderOpen,
  X,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  tier_required: string;
  read_time_minutes: number | null;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "credit-building", label: "Credit Building", icon: CreditCard },
  { id: "business-setup", label: "Business Setup", icon: FileText },
  { id: "strategy", label: "Strategy", icon: Gift },
  { id: "checklists", label: "Checklists", icon: CheckSquare },
  { id: "personal-brand", label: "Personal Brand", icon: User },
  { id: "templates", label: "Templates", icon: FolderOpen },
] as const;

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  start: "Starter",
  build: "Pro",
  scale: "Elite",
};

export default function ResourcesPreview() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description, category, tier_required, read_time_minutes")
        .eq("is_published", true)
        .order("category")
        .order("sort_order");

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || resource.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  const freeResources = filteredResources.filter((r) => r.tier_required === "free");
  const premiumResources = filteredResources.filter((r) => r.tier_required !== "free");

  const getCategoryIcon = (categoryId: string) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    return cat?.icon || BookOpen;
  };

  return (
    <>
      <Helmet>
        <title>Knowledge Library | NÈKO Business Credit Resources</title>
        <meta
          name="description"
          content="Explore our comprehensive library of business credit guides, checklists, and strategies. Free resources to help you build credit with confidence."
        />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <BookOpen className="h-3 w-3 mr-1" />
                Knowledge Library
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Build Business Credit with Confidence
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Access expert guides, step-by-step checklists, and proven strategies. 
                Everything you need to establish and grow your business credit profile.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Get Free Access
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Already a Member? Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          <Sparkles className="absolute top-10 right-10 h-24 w-24 text-primary/5 hidden lg:block" />
        </section>

        {/* Stats Bar */}
        <section className="border-b border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{resources.length}</div>
                <div className="text-sm text-muted-foreground">Resources</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{freeResources.length}</div>
                <div className="text-sm text-muted-foreground">Free Guides</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {CATEGORIES.filter((c) => c.id !== "all").length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {resources.reduce((acc, r) => acc + (r.read_time_minutes || 0), 0)}+
                </div>
                <div className="text-sm text-muted-foreground">Minutes of Content</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section id="main-content" className="max-w-6xl mx-auto px-4 py-12" tabIndex={-1}>
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                aria-label="Search resources"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  aria-pressed={selectedCategory === category.id}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Free Resources Section */}
              {freeResources.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Free Access
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {freeResources.length} resources available
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {freeResources.map((resource) => {
                      const CategoryIcon = getCategoryIcon(resource.category);
                      return (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                              <CategoryIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            {resource.read_time_minutes && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {resource.read_time_minutes} min read
                              </span>
                            )}
                            <Link to="/signup">
                              <Button variant="ghost" size="sm" className="text-primary">
                                Read Now
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Premium Resources Section */}
              {premiumResources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium Content
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {premiumResources.length} resources with membership
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {premiumResources.map((resource) => {
                      const CategoryIcon = getCategoryIcon(resource.category);
                      return (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative bg-muted/30 border border-dashed border-muted-foreground/30 rounded-xl p-5"
                        >
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="text-xs">
                              {TIER_LABELS[resource.tier_required] || "Premium"}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground flex-shrink-0">
                              <CategoryIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0 pr-16">
                              <h3 className="font-semibold text-muted-foreground line-clamp-2">
                                {resource.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground/70 line-clamp-2 mb-4">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            {resource.read_time_minutes && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                <Clock className="h-3 w-3" />
                                {resource.read_time_minutes} min
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Lock className="h-3 w-3" />
                              Unlock with membership
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of entrepreneurs using NÈKO to build business credit. 
              Get instant access to free resources and start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
