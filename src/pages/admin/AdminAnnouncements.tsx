import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Megaphone,
  Info,
  AlertTriangle,
  CheckCircle,
  Bell,
  Trash2,
  Calendar,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "announcement";
  target: "all" | "free" | "paid";
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

const ANNOUNCEMENT_TYPES = [
  { value: "info", label: "Info", icon: Info, color: "text-blue-500" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-yellow-500" },
  { value: "success", label: "Success", icon: CheckCircle, color: "text-green-500" },
  { value: "announcement", label: "Announcement", icon: Megaphone, color: "text-primary" },
];

const TARGET_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "free", label: "Free Users Only" },
  { value: "paid", label: "Paid Users Only" },
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as Announcement["type"],
    target: "all" as Announcement["target"],
    is_active: true,
    starts_at: new Date().toISOString().split("T")[0],
    ends_at: "",
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
      toast.error("We couldn't load announcements right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toIsoDate = (value: string) => {
    return new Date(value).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please add a title and message for this announcement.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
        target: formData.target,
        is_active: formData.is_active,
        starts_at: toIsoDate(formData.starts_at),
        ends_at: formData.ends_at ? toIsoDate(formData.ends_at) : null,
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingAnnouncement.id);

        if (error) throw error;
        toast.success("Announcement updated.");
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert(payload);

        if (error) throw error;
        toast.success("Announcement created — your users will see it soon.");
      }

      setIsDialogOpen(false);
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("That didn't save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("Announcement removed.");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("We couldn't delete that. Please try again.");
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !announcement.is_active })
        .eq("id", announcement.id);

      if (error) throw error;
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === announcement.id ? { ...a, is_active: !a.is_active } : a
        )
      );
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("That didn't work. Please try again.");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      target: announcement.target,
      is_active: announcement.is_active,
      starts_at: format(new Date(announcement.starts_at), "yyyy-MM-dd"),
      ends_at: announcement.ends_at ? format(new Date(announcement.ends_at), "yyyy-MM-dd") : "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      message: "",
      type: "info",
      target: "all",
      is_active: true,
      starts_at: new Date().toISOString().split("T")[0],
      ends_at: "",
    });
  };

  const activeCount = announcements.filter((a) => a.is_active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-primary-foreground/60">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
            Announcements
          </h1>
          <p className="text-primary-foreground/60">
            Keep your users in the loop with updates, tips, and news.
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
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Announcement message..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Announcement["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNOUNCEMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target">Target Audience</Label>
                  <Select
                    value={formData.target}
                    onValueChange={(value: Announcement["target"]) =>
                      setFormData((prev) => ({ ...prev, target: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starts_at">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, starts_at: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ends_at">End Date (optional)</Label>
                  <Input
                    id="ends_at"
                    type="date"
                    value={formData.ends_at}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ends_at: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Show this announcement to users
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
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
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingAnnouncement ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Total Announcements</p>
          <p className="text-2xl font-bold text-primary-foreground">{announcements.length}</p>
        </div>
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
          <p className="text-sm text-primary-foreground/60">Active</p>
          <p className="text-2xl font-bold text-green-500">{activeCount}</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 text-center"
          >
            <Bell className="h-12 w-12 text-primary-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-primary-foreground mb-2">No announcements yet</h3>
            <p className="text-primary-foreground/60 text-sm">
              When you have something to share, create an announcement and your users will see it.
            </p>
          </motion.div>
        ) : (
          announcements.map((announcement, index) => {
            const typeInfo = ANNOUNCEMENT_TYPES.find((t) => t.value === announcement.type);
            const TypeIcon = typeInfo?.icon || Info;

            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-primary-foreground/5 border rounded-xl p-4 ${
                  announcement.is_active
                    ? "border-primary-foreground/20"
                    : "border-primary-foreground/10 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${typeInfo?.color}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-primary-foreground/60 mt-1">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-primary-foreground/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(announcement.starts_at), "MMM d, yyyy")}
                          {announcement.ends_at && (
                            <> – {format(new Date(announcement.ends_at), "MMM d, yyyy")}</>
                          )}
                        </span>
                        <span className="capitalize">
                          Target: {announcement.target === "all" ? "Everyone" : announcement.target}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={announcement.is_active}
                      onCheckedChange={() => handleToggleActive(announcement)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(announcement)}
                      className="h-8 w-8 text-primary-foreground/60 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(announcement.id)}
                      className="h-8 w-8 text-primary-foreground/60 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
