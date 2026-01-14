import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";
import { FeatureGate } from "@/components/FeatureGate";
import { useFeatureGate } from "@/hooks/use-feature-gate";
import { PageLoader } from "@/components/LoadingStates";
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
import type { Feature } from "@/lib/entitlements";

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
  show_email_publicly: boolean;
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

// Tab configuration with feature requirements
const TABS = [
  { id: "profile", label: "Profile", icon: User, feature: null },
  { id: "projects", label: "Projects", icon: Briefcase, feature: null },
  { id: "links", label: "Links", icon: Link2, feature: null },
  { id: "seo", label: "SEO", icon: Search, feature: "personal_brand_seo" as Feature },
] as const;

export default function PersonalBrandBuilder() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cv, setCV] = useState<DigitalCV | null>(null);

  // Feature access checks
  const seoAccess = useFeatureGate("personal_brand_seo");
  const publishAccess = useFeatureGate("personal_brand_publish");

  const loadCV = useCallback(async () => {
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
          show_email_publicly: data.show_email_publicly ?? false,
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
          show_email_publicly: false,
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
          show_email_publicly: false,
        });
      }
    } catch (error) {
      console.error("Error loading CV:", error);
      toast.error("Failed to load your profile");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

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
          show_email_publicly: cv.show_email_publicly,
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
    if (!publishAccess.hasAccess) {
      toast.error("Upgrade to Starter plan to publish your profile");
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

  // Helper to check tab access
  const getTabAccess = (feature: Feature | null): boolean => {
    if (!feature) return true;
    if (feature === "personal_brand_seo") return seoAccess.hasAccess;
    return true;
  };

  if (isLoading) {
    return <PageLoader message="Loading your brand builder..." />;
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
            Build a Digital CV that tells your story — professional, polished, and uniquely yours.
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
            disabled={isSaving || !publishAccess.hasAccess}
            className="gap-2"
            variant={cv.is_published ? "outline" : "default"}
          >
            {!publishAccess.hasAccess && <Lock className="h-4 w-4" />}
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
          {TABS.map((tab) => {
            const hasAccess = getTabAccess(tab.feature);
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
          <FeatureGate 
            feature="personal_brand_seo"
            lockedTitle="SEO Settings"
            lockedDescription="Customize your page title, description, and social sharing image to improve visibility and click-through rates."
          >
            <SEOSettings cv={cv} setCV={setCV} />
          </FeatureGate>
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
