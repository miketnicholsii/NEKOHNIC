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
  // For now, we'll store announcements in local state
  // In a full implementation, you'd create an announcements table
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as Announcement["type"],
    target: "all" as Announcement["target"],
    is_active: true,
    starts_at: new Date().toISOString().split("T")[0],
    ends_at: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please add a title and message for this announcement.");
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      target: formData.target,
      is_active: formData.is_active,
      starts_at: formData.starts_at,
      ends_at: formData.ends_at || null,
      created_at: new Date().toISOString(),
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setIsDialogOpen(false);
    resetForm();
    toast.success("Announcement created — your users will see it soon.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement removed.");
  };

  const handleToggleActive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  const resetForm = () => {
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
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
                <Button type="submit" className="flex-1">
                  Create
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
                      onCheckedChange={() => handleToggleActive(announcement.id)}
                    />
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

      {/* Note about persistence */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-primary-foreground">Heads Up</h4>
            <p className="text-sm text-primary-foreground/60 mt-1">
              These announcements are stored locally for now. For persistence across sessions, 
              consider adding an announcements table to your database.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}