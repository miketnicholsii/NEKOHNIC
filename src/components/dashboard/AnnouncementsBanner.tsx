import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { X, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";

type AnnouncementType = "info" | "warning" | "success" | "announcement";
type AnnouncementTarget = "all" | "free" | "paid";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  target: AnnouncementTarget;
}

const TYPE_CONFIG: Record<AnnouncementType, { icon: typeof Info; bg: string; iconColor: string }> = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-500",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-500",
  },
  announcement: {
    icon: Megaphone,
    bg: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
  },
};

const isValidType = (type: string): type is AnnouncementType => {
  return ["info", "warning", "success", "announcement"].includes(type);
};

const isValidTarget = (target: string): target is AnnouncementTarget => {
  return ["all", "free", "paid"].includes(target);
};

export function AnnouncementsBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const { tier } = useSubscriptionTier();

  useEffect(() => {
    loadAnnouncements();
    
    // Load dismissed IDs from localStorage
    const dismissed = localStorage.getItem("dismissed_announcements");
    if (dismissed) {
      try {
        setDismissedIds(JSON.parse(dismissed));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, message, type, target")
        .eq("is_active", true)
        .lte("starts_at", new Date().toISOString())
        .or("ends_at.is.null,ends_at.gte." + new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Type-safe mapping
      const typedData: Announcement[] = (data || [])
        .filter((item) => isValidType(item.type) && isValidTarget(item.target))
        .map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type as AnnouncementType,
          target: item.target as AnnouncementTarget,
        }));
      
      setAnnouncements(typedData);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_announcements", JSON.stringify(newDismissed));
  };

  // Filter announcements based on user tier and dismissed status
  const visibleAnnouncements = announcements.filter((announcement) => {
    if (dismissedIds.includes(announcement.id)) return false;
    
    if (announcement.target === "all") return true;
    if (announcement.target === "free" && tier === "free") return true;
    if (announcement.target === "paid" && tier !== "free") return true;
    
    return false;
  });

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence mode="popLayout">
        {visibleAnnouncements.map((announcement) => {
          const config = TYPE_CONFIG[announcement.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border p-4 ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary-foreground text-sm">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-primary-foreground/70 mt-0.5">
                    {announcement.message}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(announcement.id)}
                  className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors p-1 -m-1"
                  aria-label="Dismiss announcement"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}