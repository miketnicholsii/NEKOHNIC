import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { tierMeetsRequirement, SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import {
  Search,
  BookOpen,
  Clock,
  Lock,
  Filter,
  X,
  FileText,
  CreditCard,
  User,
  CheckSquare,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  tier_required: "free" | "start" | "build" | "scale";
  read_time_minutes: number | null;
  sort_order: number | null;
  is_published: boolean | null;
}

const CATEGORIES = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "business-setup", label: "Business Setup", icon: FileText },
  { id: "credit-building", label: "Credit Building", icon: CreditCard },
  { id: "personal-brand", label: "Personal Brand", icon: User },
  { id: "checklists", label: "Checklists", icon: CheckSquare },
  { id: "templates", label: "Templates", icon: FolderOpen },
];

const TIER_BADGES = {
  free: { label: "Free", color: "bg-muted text-muted-foreground" },
  start: { label: "Start", color: "bg-primary/10 text-primary" },
  build: { label: "Build", color: "bg-secondary/10 text-secondary" },
  scale: { label: "Scale", color: "bg-tertiary text-tertiary-foreground" },
};

export default function Resources() {
  const { subscription } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const userTier = subscription?.tier || "free";

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
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

  // Filter resources based on search and category
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

  // Group resources by category for display
  const groupedResources = useMemo(() => {
    if (selectedCategory !== "all") {
      return { [selectedCategory]: filteredResources };
    }

    const groups: Record<string, Resource[]> = {};
    filteredResources.forEach((resource) => {
      if (!groups[resource.category]) {
        groups[resource.category] = [];
      }
      groups[resource.category].push(resource);
    });
    return groups;
  }, [filteredResources, selectedCategory]);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  };

  const handleResourceClick = (resource: Resource) => {
    const hasAccess = tierMeetsRequirement(userTier, resource.tier_required);
    if (hasAccess) {
      setSelectedResource(resource);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Curated guides, templates, and checklists to help you build your business.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 sm:hidden"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar - Desktop */}
        <div className="hidden sm:block w-56 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <nav className="space-y-1">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const count =
                  category.id === "all"
                    ? resources.length
                    : resources.filter((r) => r.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        selectedCategory === category.id
                          ? "bg-primary-foreground/20"
                          : "bg-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Tier Legend */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Access Levels
              </h4>
              <div className="space-y-1">
                {Object.entries(TIER_BADGES).map(([tier, badge]) => (
                  <div key={tier} className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-muted-foreground">
                      {tier === userTier && "(Your plan)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden absolute left-0 right-0 z-10 bg-card border border-border rounded-xl p-4 mx-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Grid */}
        <div className="flex-1">
          {filteredResources.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back soon for new content"}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedResources).map(([category, categoryResources]) => {
                const categoryInfo = getCategoryInfo(category);
                const CategoryIcon = categoryInfo.icon;

                return (
                  <div key={category}>
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 mb-4">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-foreground">
                          {categoryInfo.label}
                        </h2>
                      </div>
                    )}

                    <div className="grid gap-4">
                      {categoryResources.map((resource) => {
                        const hasAccess = tierMeetsRequirement(
                          userTier,
                          resource.tier_required
                        );
                        const tierBadge = TIER_BADGES[resource.tier_required];

                        return (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-card border border-border rounded-xl p-4 transition-all ${
                              hasAccess
                                ? "cursor-pointer hover:border-primary/50 hover:shadow-md"
                                : "opacity-75"
                            }`}
                            onClick={() => handleResourceClick(resource)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground truncate">
                                    {resource.title}
                                  </h3>
                                  {resource.tier_required !== "free" && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-medium ${tierBadge.color}`}
                                    >
                                      {tierBadge.label}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {resource.description}
                                </p>
                                {resource.read_time_minutes && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {resource.read_time_minutes} min read
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                {hasAccess ? (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    <span>{tierBadge.label}+</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resource Detail Modal */}
      <Dialog
        open={!!selectedResource}
        onOpenChange={(open) => !open && setSelectedResource(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedResource.tier_required !== "free" && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        TIER_BADGES[selectedResource.tier_required].color
                      }`}
                    >
                      {TIER_BADGES[selectedResource.tier_required].label}
                    </span>
                  )}
                  {selectedResource.read_time_minutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {selectedResource.read_time_minutes} min read
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl">
                  {selectedResource.title}
                </DialogTitle>
                <p className="text-muted-foreground">
                  {selectedResource.description}
                </p>
              </DialogHeader>

              <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {selectedResource.content}
                </div>
              </div>

              {/* Related Resources */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">
                  More in {getCategoryInfo(selectedResource.category).label}
                </h4>
                <div className="space-y-2">
                  {resources
                    .filter(
                      (r) =>
                        r.category === selectedResource.category &&
                        r.id !== selectedResource.id
                    )
                    .slice(0, 3)
                    .map((resource) => {
                      const hasAccess = tierMeetsRequirement(
                        userTier,
                        resource.tier_required
                      );
                      return (
                        <button
                          key={resource.id}
                          onClick={() =>
                            hasAccess && setSelectedResource(resource)
                          }
                          disabled={!hasAccess}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                            hasAccess
                              ? "border-border hover:border-primary/50"
                              : "border-border/50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <span className="text-sm font-medium text-foreground">
                            {resource.title}
                          </span>
                          {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
