import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Linkedin, Instagram, Mail, Eye, MousePointer, Share2, Settings } from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const profile = {
  name: "Alex Rivera",
  headline: "Founder & Creative Director",
  bio: "Building brands that resonate. Helping startups tell their story with clarity and purpose.",
  skills: ["Brand Strategy", "Visual Design", "Content Creation", "Web Development"],
};

const links = [
  { icon: Globe, label: "Website", url: "alexrivera.co" },
  { icon: Linkedin, label: "LinkedIn", url: "linkedin.com/in/alexrivera" },
  { icon: Instagram, label: "Instagram", url: "@alexrivera.studio" },
];

const projects = [
  { title: "Noma Collective", type: "Brand Identity", color: "bg-primary/20" },
  { title: "Vertex Labs", type: "Web Design", color: "bg-secondary/20" },
];

const expandedProjects = [
  { title: "Noma Collective", type: "Brand Identity", color: "bg-primary/20", description: "Complete rebrand for sustainable fashion collective" },
  { title: "Vertex Labs", type: "Web Design", color: "bg-secondary/20", description: "Landing page and product showcase for AI startup" },
  { title: "Bloom Studio", type: "Visual Identity", color: "bg-accent/20", description: "Logo and brand guidelines for wellness brand" },
  { title: "TechFlow", type: "UI/UX Design", color: "bg-muted", description: "Dashboard redesign for SaaS platform" },
];

const analytics = [
  { label: "Profile Views", value: "1,247", change: "+23%" },
  { label: "Link Clicks", value: "342", change: "+18%" },
  { label: "Shares", value: "56", change: "+8%" },
];

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-lg">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Personal Brand Builder</h3>
            <p className="text-xs text-muted-foreground">Your Digital CV</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-medium text-primary">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-foreground text-sm">{profile.name}</h4>
                <p className="text-xs text-primary">{profile.headline}</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="px-2 py-1 rounded-md bg-muted text-[10px] text-muted-foreground"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <h5 className="text-xs font-semibold text-foreground mb-3">Links</h5>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-foreground">{link.label}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <h5 className="text-xs font-semibold text-foreground mb-3">Projects</h5>
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg ${project.color}`} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{project.title}</p>
                      <p className="text-[10px] text-muted-foreground">{project.type}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandedContent() {
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-3 gap-4">
        {analytics.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border border-border text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {stat.label === "Profile Views" && <Eye className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Link Clicks" && <MousePointer className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Shares" && <Share2 className="h-4 w-4 text-muted-foreground" />}
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-primary">{stat.change} this month</p>
          </motion.div>
        ))}
      </div>

      {/* Full Profile Preview */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Profile Preview</h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary">Live at alexrivera.co</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              AR
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground">{profile.name}</h3>
              <p className="text-primary font-medium">{profile.headline}</p>
              <p className="text-muted-foreground mt-2 max-w-md">{profile.bio}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {profile.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
                {skill}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {links.map((link) => (
              <div
                key={link.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <link.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Featured Projects</h4>
          <button className="text-xs text-primary hover:underline">Edit Projects</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {expandedProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={`w-full h-24 rounded-lg ${project.color} mb-3`} />
              <h5 className="font-medium text-foreground">{project.title}</h5>
              <p className="text-xs text-muted-foreground">{project.type}</p>
              <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Quick Access */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground text-sm">SEO Settings</p>
            <p className="text-xs text-muted-foreground">Optimize your profile for search engines</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Configure
        </button>
      </div>
    </div>
  );
}

export const PersonalBrandPreview = memo(function PersonalBrandPreview() {
  return (
    <PreviewWrapper title="Personal Brand Builder" expandedContent={<ExpandedContent />}>
      <PreviewContent />
    </PreviewWrapper>
  );
});
