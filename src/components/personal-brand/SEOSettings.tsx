import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DigitalCV } from "@/pages/app/PersonalBrandBuilder";
import { toast } from "sonner";
import { Globe, Search, Share2, AlertCircle } from "lucide-react";

interface Props {
  cv: DigitalCV;
  setCV: React.Dispatch<React.SetStateAction<DigitalCV | null>>;
}

export default function SEOSettings({ cv, setCV }: Props) {
  const [slugError, setSlugError] = useState("");

  const handleSlugChange = (value: string) => {
    // Clean slug: lowercase, only alphanumeric and hyphens
    const cleanedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    
    if (cleanedSlug.length > 0 && cleanedSlug.length < 3) {
      setSlugError("Slug must be at least 3 characters");
    } else if (cleanedSlug.length > 50) {
      setSlugError("Slug must be less than 50 characters");
    } else {
      setSlugError("");
    }
    
    setCV(prev => prev ? { ...prev, slug: cleanedSlug || null } : null);
  };

  const previewUrl = cv.slug ? `${window.location.origin}/p/${cv.slug}` : null;

  return (
    <div className="space-y-6">
      {/* URL Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Custom URL</h3>
        </div>
        
        <div>
          <Label htmlFor="slug">Your Profile URL</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-l-lg border border-r-0 border-input">
              {window.location.origin}/p/
            </span>
            <Input
              id="slug"
              value={cv.slug || ""}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="your-name"
              className="rounded-l-none"
            />
          </div>
          {slugError && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {slugError}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Only letters, numbers, and hyphens allowed
          </p>
          
          {previewUrl && !slugError && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground font-medium">Your profile will be available at:</p>
              <p className="text-sm text-primary break-all">{previewUrl}</p>
            </div>
          )}
        </div>
      </div>

      {/* Meta Tags */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Search Engine Optimization</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="seo_title">Page Title</Label>
            <Input
              id="seo_title"
              value={cv.seo_title || ""}
              onChange={(e) => setCV(prev => prev ? { ...prev, seo_title: e.target.value } : null)}
              placeholder={cv.headline || "Your Name - Professional Profile"}
              className="mt-1.5"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Appears in search results and browser tabs
              </p>
              <p className={`text-xs ${(cv.seo_title?.length || 0) > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                {cv.seo_title?.length || 0}/60
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="seo_description">Meta Description</Label>
            <Textarea
              id="seo_description"
              value={cv.seo_description || ""}
              onChange={(e) => setCV(prev => prev ? { ...prev, seo_description: e.target.value } : null)}
              placeholder="A brief summary of who you are and what you do..."
              className="mt-1.5 min-h-[80px]"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Shown in search engine results
              </p>
              <p className={`text-xs ${(cv.seo_description?.length || 0) > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                {cv.seo_description?.length || 0}/160
              </p>
            </div>
          </div>
        </div>

        {/* Search Preview */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Search Preview</p>
          <div className="space-y-1">
            <p className="text-lg text-blue-600 hover:underline cursor-pointer truncate">
              {cv.seo_title || cv.headline || "Your Name - Professional Profile"}
            </p>
            <p className="text-sm text-green-700 truncate">
              {previewUrl || `${window.location.origin}/p/your-slug`}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {cv.seo_description || cv.bio || "Add a meta description to improve how your profile appears in search results."}
            </p>
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Social Sharing</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          When your profile is shared on social media, this image and information will be displayed.
        </p>

        {/* Social Preview */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {cv.social_image_url ? (
              <img
                src={cv.social_image_url}
                alt="Social preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Upload a profile image to customize social sharing
              </p>
            )}
          </div>
          <div className="p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase mb-1">
              {window.location.host}
            </p>
            <p className="font-medium text-foreground text-sm truncate">
              {cv.seo_title || cv.headline || "Your Profile"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {cv.seo_description || cv.bio || "Your professional profile"}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-3">📈 SEO Best Practices</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Keep your title under 60 characters for full display in search results</li>
          <li>• Write a compelling meta description under 160 characters</li>
          <li>• Include relevant keywords naturally in your content</li>
          <li>• Use a professional, high-quality profile image</li>
          <li>• Choose a memorable, easy-to-share URL slug</li>
        </ul>
      </div>
    </div>
  );
}
