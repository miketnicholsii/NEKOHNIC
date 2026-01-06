import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { tierMeetsRequirement } from "@/lib/subscription-tiers";
import ProfileEditor from "@/components/personal-brand/ProfileEditor";
import ProjectsEditor from "@/components/personal-brand/ProjectsEditor";
import LinksEditor from "@/components/personal-brand/LinksEditor";
import SEOSettings from "@/components/personal-brand/SEOSettings";
import ProfilePreview from "@/components/personal-brand/ProfilePreview";
import {
  User,
  Briefcase,
  Link2,
  Search,
  Eye,
  Save,
  ExternalLink,
  Lock,
} from "lucide-react";

export interface DigitalCV {
  id: string;
  user_id: string;
  slug: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[] | null;
  projects: Project[] | null;
  links: SocialLink[] | null;
  contact_email: string | null;
  goals: string | null;
  seo_title: string | null;
  seo_description: string | null;
  social_image_url: string | null;
  template: string | null;
  is_published: boolean | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

export default function PersonalBrandBuilder() {
  const { user, subscription } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cv, setCV] = useState<DigitalCV | null>(null);

  const userTier = subscription?.tier || "free";
  const hasSEOAccess = tierMeetsRequirement(userTier, "build");
  const hasPublishAccess = tierMeetsRequirement(userTier, "start");

  useEffect(() => {
    loadCV();
  }, [user]);

  const loadCV = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("digital_cv")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Parse JSON fields with proper typing
        const projects = Array.isArray(data.projects) ? data.projects as unknown as Project[] : [];
        const links = Array.isArray(data.links) ? data.links as unknown as SocialLink[] : [];
        setCV({
          ...data,
          projects,
          links,
        });
      } else {
        // Create initial CV record
        const initialCV = {
          user_id: user.id,
          slug: null,
          headline: null,
          bio: null,
          skills: [],
          projects: [],
          links: [],
          template: "default",
          is_published: false,
        };

        const { data: newCV, error: insertError } = await supabase
          .from("digital_cv")
          .insert(initialCV)
          .select()
          .single();

        if (insertError) throw insertError;
        setCV({
          ...newCV,
          projects: [],
          links: [],
        });
      }
    } catch (error) {
      console.error("Error loading CV:", error);
      toast.error("Failed to load your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !cv) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("digital_cv")
        .update({
          slug: cv.slug,
          headline: cv.headline,
          bio: cv.bio,
          skills: cv.skills,
          projects: JSON.parse(JSON.stringify(cv.projects || [])),
          links: JSON.parse(JSON.stringify(cv.links || [])),
          contact_email: cv.contact_email,
          goals: cv.goals,
          seo_title: cv.seo_title,
          seo_description: cv.seo_description,
          social_image_url: cv.social_image_url,
          template: cv.template,
          is_published: cv.is_published,
        })
        .eq("id", cv.id);

      if (error) throw error;
      toast.success("Profile saved!");
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!hasPublishAccess) {
      toast.error("Upgrade to Start plan to publish your profile");
      return;
    }

    if (!cv?.slug) {
      toast.error("Please set a custom URL slug before publishing");
      setActiveTab("seo");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("digital_cv")
        .update({ is_published: !cv.is_published })
        .eq("id", cv.id);

      if (error) throw error;

      setCV(prev => prev ? { ...prev, is_published: !prev.is_published } : null);
      toast.success(cv.is_published ? "Profile unpublished" : "Profile published! 🎉");
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Failed to update publish status");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "links", label: "Links", icon: Link2 },
    { id: "seo", label: "SEO", icon: Search, tier: "build" as const },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!cv) return null;

  const publicUrl = cv.slug ? `${window.location.origin}/p/${cv.slug}` : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Personal Brand Builder
          </h1>
          <p className="text-muted-foreground">
            Create your Digital CV — a professional page that showcases your story.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSaving || !hasPublishAccess}
            className="gap-2"
            variant={cv.is_published ? "outline" : "default"}
          >
            {!hasPublishAccess && <Lock className="h-4 w-4" />}
            {cv.is_published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Published URL Banner */}
      {cv.is_published && publicUrl && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-foreground">Your profile is live!</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {publicUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              toast.success("URL copied!");
            }}
          >
            Copy Link
          </Button>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          {tabs.map((tab) => {
            const hasAccess = !tab.tier || tierMeetsRequirement(userTier, tab.tier);
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled={!hasAccess}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                {hasAccess ? (
                  <tab.icon className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileEditor cv={cv} setCV={setCV} userId={user?.id || ""} />
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <ProjectsEditor cv={cv} setCV={setCV} userId={user?.id || ""} />
        </TabsContent>

        <TabsContent value="links" className="mt-0">
          <LinksEditor cv={cv} setCV={setCV} />
        </TabsContent>

        <TabsContent value="seo" className="mt-0">
          {hasSEOAccess ? (
            <SEOSettings cv={cv} setCV={setCV} />
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">SEO Settings</h3>
              <p className="text-muted-foreground mb-4">
                Customize your page title, description, and social sharing image.
              </p>
              <p className="text-sm text-primary font-medium">
                Upgrade to Build plan to unlock SEO settings
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <ProfilePreview
        cv={cv}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </div>
  );
}
