import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { DigitalCV } from "@/pages/app/PersonalBrandBuilder";
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
} from "lucide-react";

interface Props {
  cv: DigitalCV;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function ProfilePreview({ cv, open, onOpenChange }: Props) {
  const template = cv.template || "default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className={`min-h-[500px] ${
          template === "default" ? "bg-gradient-to-br from-background to-muted" :
          template === "minimal" ? "bg-background" :
          "bg-gradient-to-br from-tertiary to-tertiary/80"
        }`}>
          {/* Header Section */}
          <div className={`p-8 text-center ${
            template === "bold" ? "text-tertiary-foreground" : ""
          }`}>
            {/* Profile Image */}
            {cv.social_image_url ? (
              <img
                src={cv.social_image_url}
                alt="Profile"
                className={`w-28 h-28 rounded-full object-cover mx-auto mb-6 ${
                  template === "default" ? "border-4 border-primary/20 shadow-lg" :
                  template === "minimal" ? "border-2 border-border" :
                  "border-4 border-tertiary-foreground/20"
                }`}
              />
            ) : (
              <div className={`w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center ${
                template === "default" ? "bg-primary/10 border-4 border-primary/20" :
                template === "minimal" ? "bg-muted border-2 border-border" :
                "bg-tertiary-foreground/10 border-4 border-tertiary-foreground/20"
              }`}>
                <span className={`text-3xl font-bold ${
                  template === "bold" ? "text-tertiary-foreground" : "text-muted-foreground"
                }`}>
                  {cv.headline?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
              template === "bold" ? "text-tertiary-foreground" : "text-foreground"
            }`}>
              {cv.headline || "Your Name"}
            </h1>

            {/* Bio */}
            {cv.bio && (
              <p className={`max-w-md mx-auto ${
                template === "bold" ? "text-tertiary-foreground/80" : "text-muted-foreground"
              }`}>
                {cv.bio}
              </p>
            )}

            {/* Contact Email - only shown if user opted in */}
            {cv.contact_email && cv.show_email_publicly && (
              <a
                href={`mailto:${cv.contact_email}`}
                className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  template === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                  template === "minimal" ? "bg-muted text-foreground hover:bg-muted/80" :
                  "bg-tertiary-foreground text-tertiary hover:bg-tertiary-foreground/90"
                }`}
              >
                <Mail className="h-4 w-4" />
                Contact Me
              </a>
            )}
          </div>

          {/* Skills */}
          {cv.skills && cv.skills.length > 0 && (
            <div className={`px-8 pb-6 ${
              template === "bold" ? "text-tertiary-foreground" : ""
            }`}>
              <h2 className={`text-lg font-semibold mb-3 text-center ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {cv.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 rounded-full text-sm ${
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
            <div className={`px-8 pb-6 ${
              template === "bold" ? "" : ""
            }`}>
              <h2 className={`text-lg font-semibold mb-4 text-center ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Projects
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cv.projects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-xl overflow-hidden ${
                      template === "default" ? "bg-card border border-border" :
                      template === "minimal" ? "bg-muted" :
                      "bg-tertiary-foreground/10"
                    }`}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className={`w-full h-32 ${
                        template === "bold" 
                          ? "bg-tertiary-foreground/5" 
                          : "bg-gradient-to-br from-primary/10 to-primary/5"
                      }`} />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${
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
                              template === "bold" ? "text-tertiary-foreground/70" : "text-primary"
                            }`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className={`text-sm mt-1 line-clamp-2 ${
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
            <div className={`px-8 pb-6 ${
              template === "bold" ? "text-tertiary-foreground" : ""
            }`}>
              <h2 className={`text-lg font-semibold mb-3 text-center ${
                template === "bold" ? "text-tertiary-foreground" : "text-foreground"
              }`}>
                Goals & Vision
              </h2>
              <p className={`text-center max-w-md mx-auto ${
                template === "bold" ? "text-tertiary-foreground/80" : "text-muted-foreground"
              }`}>
                {cv.goals}
              </p>
            </div>
          )}

          {/* Social Links */}
          {cv.links && cv.links.length > 0 && (
            <div className="px-8 pb-8">
              <div className="flex justify-center gap-3 flex-wrap">
                {cv.links.map((link) => {
                  const Icon = PLATFORM_ICONS[link.platform] || Link2;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
