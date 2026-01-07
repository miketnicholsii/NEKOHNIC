import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import {
  Mail,
  ExternalLink,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Globe,
  Youtube,
  Facebook,
  Link2,
  ArrowLeft,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

interface DigitalCV {
  id: string;
  slug: string;
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

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  other: Link2,
};

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [cv, setCV] = useState<DigitalCV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        // Query public CVs - email exposure is controlled by show_email_publicly flag
        const { data, error } = await supabase
          .from("digital_cv")
          .select("id, slug, headline, bio, goals, skills, links, projects, template, is_published, show_email_publicly, contact_email, seo_title, seo_description, social_image_url, created_at, updated_at")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const projects = Array.isArray(data.projects) ? data.projects as unknown as Project[] : [];
          const links = Array.isArray(data.links) ? data.links as unknown as SocialLink[] : [];
          setCV({
            ...data,
            projects,
            links,
            // Only expose contact_email if user explicitly consented
            contact_email: data.show_email_publicly ? data.contact_email : null,
            show_email_publicly: data.show_email_publicly ?? false,
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (notFound || !cv) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This profile doesn't exist or isn't published yet.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to homepage
        </Link>
      </div>
    );
  }

  const template = cv.template || "default";
  const pageTitle = cv.seo_title || cv.headline || "Profile";
  const pageDescription = cv.seo_description || cv.bio || "";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {cv.social_image_url && (
          <meta property="og:image" content={cv.social_image_url} />
        )}
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {cv.social_image_url && (
          <meta name="twitter:image" content={cv.social_image_url} />
        )}
      </Helmet>

      <div className={`min-h-screen ${
        template === "default" ? "bg-gradient-to-br from-background to-muted" :
        template === "minimal" ? "bg-background" :
        "bg-gradient-to-br from-tertiary to-tertiary/80"
      }`}>
        <div className="max-w-2xl mx-auto py-12 px-4">
          {/* Header Section */}
          <div className={`text-center mb-8 ${
            template === "bold" ? "text-tertiary-foreground" : ""
          }`}>
            {/* Profile Image */}
            {cv.social_image_url ? (
              <img
                src={cv.social_image_url}
                alt="Profile"
                className={`w-32 h-32 rounded-full object-cover mx-auto mb-6 ${
                  template === "default" ? "border-4 border-primary/20 shadow-lg" :
                  template === "minimal" ? "border-2 border-border" :
                  "border-4 border-tertiary-foreground/20"
                }`}
              />
            ) : (
              <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                template === "default" ? "bg-primary/10 border-4 border-primary/20" :
                template === "minimal" ? "bg-muted border-2 border-border" :
                "bg-tertiary-foreground/10 border-4 border-tertiary-foreground/20"
              }`}>
                <span className={`text-4xl font-bold ${
                  template === "bold" ? "text-tertiary-foreground" : "text-muted-foreground"
                }`}>
                  {cv.headline?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${
              template === "bold" ? "text-tertiary-foreground" : "text-foreground"
            }`}>
              {cv.headline || "Hello!"}
            </h1>

            {/* Bio */}
            {cv.bio && (
              <p className={`text-lg max-w-lg mx-auto ${
                template === "bold" ? "text-tertiary-foreground/80" : "text-muted-foreground"
              }`}>
                {cv.bio}
              </p>
            )}

            {/* Contact Email - only shown if user opted in */}
            {cv.contact_email && cv.show_email_publicly && (
              <a
                href={`mailto:${cv.contact_email}`}
                className={`inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-medium transition-colors ${
                  template === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                  template === "minimal" ? "bg-foreground text-background hover:bg-foreground/90" :
                  "bg-tertiary-foreground text-tertiary hover:bg-tertiary-foreground/90"
                }`}
              >
                <Mail className="h-5 w-5" />
                Contact Me
              </a>
            )}
          </div>

          {/* Skills */}
          {cv.skills && cv.skills.length > 0 && (
            <div className="mb-10">
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {cv.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      template === "default" ? "bg-primary/10 text-primary" :
                      template === "minimal" ? "bg-muted text-muted-foreground" :
                      "bg-tertiary-foreground/10 text-tertiary-foreground"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cv.projects && cv.projects.length > 0 && (
            <div className="mb-10">
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Projects
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cv.projects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-xl overflow-hidden ${
                      template === "default" ? "bg-card border border-border shadow-sm" :
                      template === "minimal" ? "bg-muted" :
                      "bg-tertiary-foreground/10"
                    }`}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className={`w-full h-40 ${
                        template === "bold" 
                          ? "bg-tertiary-foreground/5" 
                          : "bg-gradient-to-br from-primary/10 to-primary/5"
                      }`} />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold ${
                          template === "bold" ? "text-tertiary-foreground" : "text-foreground"
                        }`}>
                          {project.title}
                        </h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              template === "bold" ? "text-tertiary-foreground/70 hover:text-tertiary-foreground" : "text-primary hover:text-primary/80"
                            }`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className={`text-sm mt-2 ${
                          template === "bold" ? "text-tertiary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {cv.goals && (
            <div className="mb-10 text-center">
              <h2 className={`text-xl font-semibold mb-3 ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Goals & Vision
              </h2>
              <p className={`max-w-lg mx-auto ${
                template === "bold" ? "text-tertiary-foreground/80" : "text-muted-foreground"
              }`}>
                {cv.goals}
              </p>
            </div>
          )}

          {/* Social Links */}
          {cv.links && cv.links.length > 0 && (
            <div className="flex justify-center gap-4 flex-wrap mb-10">
              {cv.links.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform] || Link2;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      template === "default" ? "bg-muted hover:bg-primary/10 text-foreground hover:text-primary" :
                      template === "minimal" ? "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground" :
                      "bg-tertiary-foreground/10 hover:bg-tertiary-foreground/20 text-tertiary-foreground"
                    }`}
                    title={link.label || link.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border/20">
            <p className={`text-sm ${
              template === "bold" ? "text-tertiary-foreground/50" : "text-muted-foreground"
            }`}>
              Powered by{" "}
              <a
                href="/"
                className="hover:underline font-medium"
              >
                NÈKO
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
