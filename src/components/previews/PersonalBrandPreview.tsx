import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Linkedin, Instagram, Mail, Eye, MousePointer, Share2, Settings, User, Sparkles, Palette } from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const profile = {
  name: "Alex Rivera",
  headline: "Founder & Creative Director",
  bio: "Building brands that resonate. Helping startups tell their story with clarity and purpose.",
  skills: ["Brand Strategy", "Visual Design", "Content Creation", "Web Development"],
  initials: "AR"
};

const links = [
  { icon: Globe, label: "Website", url: "alexrivera.co", color: "text-primary" },
  { icon: Linkedin, label: "LinkedIn", url: "linkedin.com/in/alexrivera", color: "text-[#0A66C2]" },
  { icon: Instagram, label: "Instagram", url: "@alexrivera.studio", color: "text-[#E4405F]" },
];

const projects = [
  { title: "Noma Collective", type: "Brand Identity", color: "from-primary/30 to-primary/10" },
  { title: "Vertex Labs", type: "Web Design", color: "from-secondary/30 to-secondary/10" },
];

const expandedProjects = [
  { title: "Noma Collective", type: "Brand Identity", color: "from-primary/30 to-primary/10", description: "Complete rebrand for sustainable fashion collective" },
  { title: "Vertex Labs", type: "Web Design", color: "from-secondary/30 to-secondary/10", description: "Landing page and product showcase for AI startup" },
  { title: "Bloom Studio", type: "Visual Identity", color: "from-accent/30 to-accent/10", description: "Logo and brand guidelines for wellness brand" },
  { title: "TechFlow", type: "UI/UX Design", color: "from-muted to-muted/50", description: "Dashboard redesign for SaaS platform" },
];

const analytics = [
  { label: "Profile Views", value: "1,247", change: "+23%", icon: Eye },
  { label: "Link Clicks", value: "342", change: "+18%", icon: MousePointer },
  { label: "Shares", value: "56", change: "+8%", icon: Share2 },
];

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
            >
              <User className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Personal Brand Builder</h3>
              <p className="text-xs text-muted-foreground">Your Digital CV</p>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-[10px] font-semibold text-primary">Live</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary ring-2 ring-primary/20"
              >
                {profile.initials}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-foreground text-sm">{profile.name}</h4>
                <p className="text-xs text-primary font-medium">{profile.headline}</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {profile.bio}
            </p>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-1.5"
            >
              {profile.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-[10px] text-muted-foreground transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            {/* Links Card */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <h5 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Links
              </h5>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {links.map((link) => (
                  <motion.div
                    key={link.label}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <link.icon className={`h-4 w-4 ${link.color}`} />
                      <span className="text-xs text-foreground font-medium">{link.label}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Projects Card */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <h5 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                Projects
              </h5>
              <div className="space-y-2.5">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} group-hover:shadow-md transition-shadow`} />
                    <div>
                      <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{project.title}</p>
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
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4"
      >
        {analytics.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-5 rounded-2xl bg-card border border-border text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-3">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-primary mt-1 font-medium">{stat.change} this month</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Profile Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Profile Preview</h4>
          <div className="flex items-center gap-2">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-xs text-primary font-medium">Live at alexrivera.co</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-5 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-primary/20"
            >
              {profile.initials}
            </motion.div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-foreground">{profile.name}</h3>
              <p className="text-primary font-medium">{profile.headline}</p>
              <p className="text-muted-foreground mt-2 max-w-md">{profile.bio}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {profile.skills.map((skill) => (
              <motion.span 
                key={skill} 
                whileHover={{ scale: 1.05 }}
                className="px-3.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm text-muted-foreground transition-colors cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-3">
            {links.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.url}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Featured Projects</h4>
          </div>
          <button className="text-xs text-primary hover:underline font-medium">Edit Projects</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {expandedProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-border"
            >
              <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${project.color} mb-3 group-hover:shadow-md transition-shadow`} />
              <h5 className="font-medium text-foreground group-hover:text-primary transition-colors">{project.title}</h5>
              <p className="text-xs text-muted-foreground">{project.type}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Settings Quick Access */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-muted/50 to-transparent border border-border"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">SEO Settings</p>
            <p className="text-sm text-muted-foreground">Optimize your profile for search engines</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Configure
        </motion.button>
      </motion.div>
    </div>
  );
}

export const PersonalBrandPreview = memo(function PersonalBrandPreview() {
  return (
    <PreviewWrapper title="Personal Brand Builder" expandedContent={<ExpandedContent />} accentColor="secondary">
      <PreviewContent />
    </PreviewWrapper>
  );
});
