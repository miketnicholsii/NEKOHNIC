import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DigitalCV, Project } from "@/pages/app/PersonalBrandBuilder";
import { Plus, Pencil, Trash2, Upload, Briefcase, ExternalLink } from "lucide-react";

interface Props {
  cv: DigitalCV;
  setCV: React.Dispatch<React.SetStateAction<DigitalCV | null>>;
  userId: string;
}

export default function ProjectsEditor({ cv, setCV, userId }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link: "",
  });

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
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const projects = cv.projects || [];
    
    if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map(p =>
        p.id === editingProject.id
          ? { ...p, ...formData }
          : p
      );
      setCV(prev => prev ? { ...prev, projects: updatedProjects } : null);
    } else {
      // Add new project
      const newProject: Project = {
        id: crypto.randomUUID(),
        ...formData,
      };
      setCV(prev => prev ? { ...prev, projects: [...projects, newProject] } : null);
    }

    setIsDialogOpen(false);
    resetForm();
    toast.success(editingProject ? "Project updated!" : "Project added!");
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      link: project.link || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (projectId: string) => {
    if (!confirm("Delete this project?")) return;
    
    setCV(prev => prev ? {
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== projectId)
    } : null);
    toast.success("Project deleted");
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Projects & Work</h3>
            <p className="text-sm text-muted-foreground">
              Showcase your best work and achievements
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., E-commerce Website"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the project"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Project Image</Label>
                  {formData.image_url ? (
                    <div className="mt-2 relative">
                      <img
                        src={formData.image_url}
                        alt="Project preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="project-image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2 gap-2"
                        onClick={() => document.getElementById("project-image")?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    </>
                  )}
                </div>

                <div>
                  <Label htmlFor="link">Project Link</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingProject ? "Update" : "Add"} Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {(cv.projects || []).length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No projects yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add your work to showcase your expertise
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(cv.projects || []).map((project) => (
              <div
                key={project.id}
                className="group relative bg-muted/50 border border-border rounded-xl overflow-hidden"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-primary/50" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-foreground">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Edit/Delete Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEdit(project)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
