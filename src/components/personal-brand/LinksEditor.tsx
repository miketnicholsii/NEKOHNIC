import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DigitalCV, SocialLink } from "@/pages/app/PersonalBrandBuilder";
import {
  Plus,
  Pencil,
  Trash2,
  Link2,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Globe,
  Youtube,
  Facebook,
  GripVertical,
} from "lucide-react";

interface Props {
  cv: DigitalCV;
  setCV: React.Dispatch<React.SetStateAction<DigitalCV | null>>;
}

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
  { id: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "https://twitter.com/..." },
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/..." },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
  { id: "website", label: "Website", icon: Globe, placeholder: "https://..." },
  { id: "other", label: "Other", icon: Link2, placeholder: "https://..." },
];

export default function LinksEditor({ cv, setCV }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: "linkedin",
    url: "",
    label: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      toast.error("Add a URL to continue");
      return;
    }

    const links = cv.links || [];
    
    if (editingLink) {
      const updatedLinks = links.map(l =>
        l.id === editingLink.id
          ? { ...l, ...formData }
          : l
      );
      setCV(prev => prev ? { ...prev, links: updatedLinks } : null);
    } else {
      const newLink: SocialLink = {
        id: crypto.randomUUID(),
        ...formData,
      };
      setCV(prev => prev ? { ...prev, links: [...links, newLink] } : null);
    }

    setIsDialogOpen(false);
    resetForm();
    toast.success(editingLink ? "Link updated!" : "Link added!");
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      label: link.label || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (linkId: string) => {
    setCV(prev => prev ? {
      ...prev,
      links: (prev.links || []).filter(l => l.id !== linkId)
    } : null);
    toast.success("Link removed — all good");
  };

  const resetForm = () => {
    setEditingLink(null);
    setFormData({
      platform: "linkedin",
      url: "",
      label: "",
    });
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find(p => p.id === platform) || PLATFORMS[PLATFORMS.length - 1];
  };

  const selectedPlatform = getPlatformInfo(formData.platform);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Social Links</h3>
            <p className="text-sm text-muted-foreground">
              Connect your social profiles and websites
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? "Edit Link" : "Add New Link"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Platform</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {PLATFORMS.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, platform: platform.id }))}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                            formData.platform === platform.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{platform.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder={selectedPlatform.placeholder}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="label">Custom Label (optional)</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder={selectedPlatform.label}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use the platform name
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingLink ? "Update" : "Add"} Link
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links List */}
        {(cv.links || []).length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No links yet</h4>
            <p className="text-sm text-muted-foreground">
              Add your social profiles and websites
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(cv.links || []).map((link) => {
              const platformInfo = getPlatformInfo(link.platform);
              const Icon = platformInfo.icon;
              
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg group"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {link.label || platformInfo.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.url}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(link)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(link.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-3">💡 Tips for Social Links</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• <strong>LinkedIn</strong> is essential for professional networking</li>
          <li>• Add a <strong>personal website</strong> to showcase your work</li>
          <li>• Keep links current and remove inactive profiles</li>
          <li>• Use consistent branding across all platforms</li>
        </ul>
      </div>
    </div>
  );
}
