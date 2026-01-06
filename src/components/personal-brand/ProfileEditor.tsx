import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DigitalCV } from "@/pages/app/PersonalBrandBuilder";
import { Upload, X, Plus, AlertTriangle } from "lucide-react";

interface Props {
  cv: DigitalCV;
  setCV: React.Dispatch<React.SetStateAction<DigitalCV | null>>;
  userId: string;
}

export default function ProfileEditor({ cv, setCV, userId }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      setCV(prev => prev ? { ...prev, social_image_url: publicUrl } : null);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skills = cv.skills || [];
    if (skills.includes(newSkill.trim())) {
      toast.error("Skill already added");
      return;
    }

    setCV(prev => prev ? { ...prev, skills: [...skills, newSkill.trim()] } : null);
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setCV(prev => prev ? { 
      ...prev, 
      skills: (prev.skills || []).filter(s => s !== skill) 
    } : null);
  };

  return (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Profile Image</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {cv.social_image_url ? (
              <img
                src={cv.social_image_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                <span className="text-2xl font-bold text-muted-foreground">
                  {cv.headline?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
        
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={cv.headline || ""}
            onChange={(e) => setCV(prev => prev ? { ...prev, headline: e.target.value } : null)}
            placeholder="e.g., Entrepreneur & Business Consultant"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            A short tagline that describes who you are
          </p>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={cv.bio || ""}
            onChange={(e) => setCV(prev => prev ? { ...prev, bio: e.target.value } : null)}
            placeholder="Tell your story. What drives you? What have you accomplished?"
            className="mt-1.5 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={cv.contact_email || ""}
            onChange={(e) => setCV(prev => prev ? { ...prev, contact_email: e.target.value } : null)}
            placeholder="you@example.com"
            className="mt-1.5"
          />
          
          {/* Public email opt-in toggle */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Switch
                id="show_email_publicly"
                checked={cv.show_email_publicly}
                onCheckedChange={(checked) => 
                  setCV(prev => prev ? { ...prev, show_email_publicly: checked } : null)
                }
              />
              <div className="flex-1">
                <Label htmlFor="show_email_publicly" className="font-medium cursor-pointer">
                  Show email on public profile
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When enabled, visitors can see your email and use the "Contact Me" button.
                </p>
                {cv.show_email_publicly && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Your email will be visible to anyone on the internet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="goals">Goals & Vision</Label>
          <Textarea
            id="goals"
            value={cv.goals || ""}
            onChange={(e) => setCV(prev => prev ? { ...prev, goals: e.target.value } : null)}
            placeholder="What are you working towards? What's your vision?"
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Skills & Expertise</h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          />
          <Button onClick={handleAddSkill} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(cv.skills || []).map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {(cv.skills || []).length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Template</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {["default", "minimal", "bold"].map((template) => (
            <button
              key={template}
              onClick={() => setCV(prev => prev ? { ...prev, template } : null)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                cv.template === template
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className={`h-16 rounded-lg mb-2 ${
                template === "default" ? "bg-gradient-to-br from-primary/20 to-primary/5" :
                template === "minimal" ? "bg-muted" :
                "bg-gradient-to-br from-tertiary to-tertiary/50"
              }`} />
              <p className="font-medium text-foreground capitalize">{template}</p>
              <p className="text-xs text-muted-foreground">
                {template === "default" ? "Clean & professional" :
                 template === "minimal" ? "Simple & focused" :
                 "Bold & impactful"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
