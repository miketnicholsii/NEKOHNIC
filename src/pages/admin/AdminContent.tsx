import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  tier_required: "free" | "start" | "build" | "scale";
  read_time_minutes: number | null;
  sort_order: number | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "business-setup", label: "Business Setup" },
  { value: "credit-building", label: "Credit Building" },
  { value: "personal-brand", label: "Personal Brand" },
  { value: "checklists", label: "Checklists" },
  { value: "templates", label: "Templates" },
];

const TIERS = [
  { value: "free", label: "Free" },
  { value: "start", label: "Start" },
  { value: "build", label: "Build" },
  { value: "scale", label: "Scale" },
];

const TIER_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  start: "bg-primary/10 text-primary",
  build: "bg-secondary/10 text-secondary",
  scale: "bg-tertiary text-tertiary-foreground",
};

export default function AdminContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "business-setup",
    tier_required: "free" as "free" | "start" | "build" | "scale",
    read_time_minutes: "",
    sort_order: "",
    is_published: true,
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("category")
        .order("sort_order");

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast.error("We couldn't load the resources right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please add a title for this resource.");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        content: formData.content.trim() || null,
        category: formData.category,
        tier_required: formData.tier_required,
        read_time_minutes: formData.read_time_minutes ? parseInt(formData.read_time_minutes) : null,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : null,
        is_published: formData.is_published,
      };

      if (editingResource) {
        const { error } = await supabase
          .from("resources")
          .update(payload)
          .eq("id", editingResource.id);

        if (error) throw error;
        toast.success("Resource updated — changes saved.");
      } else {
        const { error } = await supabase
          .from("resources")
          .insert(payload);

        if (error) throw error;
        toast.success("Resource created — it's ready to go!");
      }

      setIsDialogOpen(false);
      resetForm();
      loadResources();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("That didn't save. Please try again.");
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || "",
      content: resource.content || "",
      category: resource.category,
      tier_required: resource.tier_required,
      read_time_minutes: resource.read_time_minutes?.toString() || "",
      sort_order: resource.sort_order?.toString() || "",
      is_published: resource.is_published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Resource removed.");
      loadResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("We couldn't delete that. Please try again.");
    }
  };

  const handleTogglePublished = async (resource: Resource) => {
    try {
      const { error } = await supabase
        .from("resources")
        .update({ is_published: !resource.is_published })
        .eq("id", resource.id);

      if (error) throw error;
      toast.success(resource.is_published ? "Resource is now hidden." : "Resource is now live!");
      loadResources();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("That didn't work. Please try again.");
    }
  };

  const resetForm = () => {
    setEditingResource(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "business-setup",
      tier_required: "free",
      read_time_minutes: "",
      sort_order: "",
      is_published: true,
    });
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || resource.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Stats
  const stats = {
    total: resources.length,
    published: resources.filter((r) => r.is_published).length,
    draft: resources.filter((r) => !r.is_published).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Resources
          </h1>
          <p className="text-muted-foreground">
            Create and share guides, templates, and helpful content for your users.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? "Edit Resource" : "Create New Resource"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Resource title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tier">Required Tier</Label>
                  <Select
                    value={formData.tier_required}
                    onValueChange={(value: "free" | "start" | "build" | "scale") =>
                      setFormData((prev) => ({ ...prev, tier_required: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    min="1"
                    value={formData.read_time_minutes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        read_time_minutes: e.target.value,
                      }))
                    }
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sort_order: e.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description for the resource card"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Full content of the resource..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="col-span-2 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="is_published">Published</Label>
                    <p className="text-xs text-muted-foreground">
                      Make this resource visible to users
                    </p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_published: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingResource ? "Update" : "Create"} Resource
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Resources</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-500">{stats.published}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.draft}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No resources found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{resource.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {resource.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {CATEGORIES.find((c) => c.value === resource.category)?.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        TIER_COLORS[resource.tier_required]
                      }`}
                    >
                      {resource.tier_required.charAt(0).toUpperCase() +
                        resource.tier_required.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleTogglePublished(resource)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        resource.is_published
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      }`}
                    >
                      {resource.is_published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(resource)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(resource.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
