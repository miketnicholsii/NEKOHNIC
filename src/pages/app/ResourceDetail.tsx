import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { tierMeetsRequirement, normalizeTier } from "@/lib/subscription-tiers";
import { supabase } from "@/integrations/supabase";
import { PageLoader } from "@/components/LoadingStates";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Lock,
  Share2,
  Bookmark,
  CheckCircle2,
  CreditCard,
  FileText,
  Gift,
  CheckSquare,
  User,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  tier_required: string;
  read_time_minutes: number | null;
  sort_order: number | null;
  is_published: boolean | null;
}

// Category icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "credit-building": CreditCard,
  "business-setup": FileText,
  "strategy": Gift,
  "checklists": CheckSquare,
  "personal-brand": User,
  "templates": FolderOpen,
};

// Tier badge styling
const TIER_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-muted text-muted-foreground" },
  start: { label: "Starter", className: "bg-primary/10 text-primary" },
  build: { label: "Pro", className: "bg-secondary/10 text-secondary" },
  scale: { label: "Elite", className: "bg-accent text-accent-foreground" },
};

// Parse content into sections for TOC
function parseContentSections(content: string | null): { id: string; title: string; content: string }[] {
  if (!content) return [];
  
  const sections: { id: string; title: string; content: string }[] = [];
  const lines = content.split("\n");
  let currentSection: { id: string; title: string; content: string } | null = null;
  
  for (const line of lines) {
    // Check for section headers (## or ###)
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = headerMatch[1].trim();
      currentSection = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        content: "",
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
    } else {
      // Content before first header
      if (!sections.length && line.trim()) {
        if (!currentSection) {
          currentSection = { id: "intro", title: "Introduction", content: "" };
        }
        currentSection.content += line + "\n";
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Format content with basic markdown rendering
function formatContent(content: string): string {
  return content
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">$1</code>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Single newlines within paragraphs
    .replace(/\n/g, "<br/>");
}

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscription } = useAuth();
  const { tier: effectiveTier, isPreviewMode } = useSubscriptionTier();
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  const userTier = normalizeTier(subscription?.tier);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (id) {
      loadResource(id);
    }
  }, [id]);

  const loadResource = async (resourceId: string) => {
    setIsLoading(true);
    try {
      // Fetch main resource
      const { data: resourceData, error: resourceError } = await supabase
        .from("resources")
        .select("*")
        .eq("id", resourceId)
        .eq("is_published", true)
        .single();

      if (resourceError) throw resourceError;
      
      setResource(resourceData);

      // Fetch related resources from same category
      if (resourceData) {
        const { data: relatedData } = await supabase
          .from("resources")
          .select("*")
          .eq("category", resourceData.category)
          .eq("is_published", true)
          .neq("id", resourceId)
          .order("sort_order")
          .limit(4);

        setRelatedResources(relatedData || []);
      }
    } catch (error) {
      console.error("Error loading resource:", error);
      toast.error("Resource not found");
      navigate("/app/resources");
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = useMemo(() => {
    if (!resource) return false;
    return tierMeetsRequirement(effectiveTier, resource.tier_required);
  }, [resource, effectiveTier]);

  const sections = useMemo(() => {
    return parseContentSections(resource?.content || null);
  }, [resource?.content]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map(s => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      if (isMobile) {
        setExpandedSections(prev => new Set(prev).add(sectionId));
      }
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: resource?.title,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading resource..." />;
  }

  if (!resource) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">
          Resource Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          This resource may have been moved or is no longer available.
        </p>
        <Link to="/app/resources">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
      </div>
    );
  }

  if (!hasAccess) {
    const tierBadge = TIER_BADGES[resource.tier_required];
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="p-4 rounded-full bg-muted inline-flex mb-6">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">
          {resource.title}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          This resource requires a {tierBadge?.label || "higher"} plan to access.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/app/resources">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Button>
          </Link>
          <Link to="/pricing">
            <Button>
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[resource.category] || BookOpen;
  const tierBadge = TIER_BADGES[resource.tier_required];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/app/resources"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents - Desktop Sidebar */}
        {sections.length > 1 && !isMobile && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                In This Article
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors truncate"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CategoryIcon className="h-5 w-5" />
              </div>
              {resource.tier_required !== "free" && (
                <Badge className={tierBadge?.className}>
                  {tierBadge?.label}
                </Badge>
              )}
              {resource.read_time_minutes && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {resource.read_time_minutes} min read
                </span>
              )}
              {isPreviewMode && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                  Preview Mode
                </Badge>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {resource.title}
            </h1>

            {resource.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Mobile: Collapsible Sections */}
          {isMobile && sections.length > 1 ? (
            <div className="space-y-4">
              {/* Expand/Collapse Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {sections.length} sections
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </div>
              </div>

              {sections.map((section) => (
                <Collapsible
                  key={section.id}
                  open={expandedSections.has(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      id={section.id}
                      className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/50 transition-colors"
                    >
                      <h2 className="font-semibold text-foreground">
                        {section.title}
                      </h2>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          expandedSections.has(section.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <CollapsibleContent forceMount>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert pt-4"
                            dangerouslySetInnerHTML={{
                              __html: `<p class="mb-4">${formatContent(section.content.trim())}</p>`,
                            }}
                          />
                        </motion.div>
                      </CollapsibleContent>
                    )}
                  </AnimatePresence>
                </Collapsible>
              ))}
            </div>
          ) : (
            /* Desktop: Full Content */
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <section key={section.id} id={section.id} className="mb-8 scroll-mt-24">
                    <h2 className="font-display text-xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<p class="mb-4 text-foreground/90 leading-relaxed">${formatContent(section.content.trim())}</p>`,
                      }}
                    />
                  </section>
                ))
              ) : (
                <div
                  className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-4">${formatContent(resource.content || "")}</p>`,
                  }}
                />
              )}
            </div>
          )}

          {/* Completion CTA */}
          <div className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Ready to put this into practice?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Take what you've learned and start building your business credit foundation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/app/business-credit">
                    <Button size="sm">
                      Go to Credit Builder
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to="/app/resources">
                    <Button variant="outline" size="sm">
                      More Resources
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            Related Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedResources.map((related) => {
              const canAccess = tierMeetsRequirement(effectiveTier, related.tier_required);
              const relatedTierBadge = TIER_BADGES[related.tier_required];
              
              return (
                <Link
                  key={related.id}
                  to={canAccess ? `/app/resources/${related.id}` : "#"}
                  onClick={(e) => !canAccess && e.preventDefault()}
                  className={`block p-4 bg-card border rounded-xl transition-all ${
                    canAccess
                      ? "border-border hover:border-primary/50 hover:shadow-md"
                      : "border-dashed border-muted-foreground/30 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-foreground text-sm line-clamp-2">
                      {related.title}
                    </h3>
                    {!canAccess && <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {related.read_time_minutes && (
                      <span>{related.read_time_minutes} min</span>
                    )}
                    {related.tier_required !== "free" && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {relatedTierBadge?.label}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
