import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  UserPen,
  Bell,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Zap,
} from "lucide-react";

interface QuickAction {
  label: string;
  icon: typeof UserPen;
  href: string;
  description: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Update Profile",
    icon: UserPen,
    href: "/app/personal-brand",
    description: "Edit your bio & links",
    color: "text-primary",
  },
  {
    label: "Add Tradeline",
    icon: Plus,
    href: "/app/business-credit",
    description: "Track new accounts",
    color: "text-emerald-600",
  },
  {
    label: "View Analytics",
    icon: BarChart3,
    href: "/app/analytics",
    description: "Check your stats",
    color: "text-blue-600",
  },
  {
    label: "Credit Score",
    icon: CreditCard,
    href: "/app/business-credit",
    description: "Update your scores",
    color: "text-amber-600",
  },
  {
    label: "Resources",
    icon: FileText,
    href: "/app/resources",
    description: "Learn & grow",
    color: "text-purple-600",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/app/account",
    description: "Manage account",
    color: "text-muted-foreground",
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      role="complementary"
      aria-label="Quick actions"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm">
              Quick Actions
            </h3>
            <p className="text-xs text-muted-foreground">
              Jump to common tasks
            </p>
          </div>
        </div>
      </div>

      {/* Actions List */}
      <nav className="p-2" aria-label="Quick action links">
        <ul className="space-y-1" role="list">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.li
                key={action.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                  aria-label={`${action.label}: ${action.description}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-muted/50 group-hover:bg-muted flex items-center justify-center transition-colors">
                    <Icon className={`h-4 w-4 ${action.color}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Notifications Section */}
      <div className="p-3 border-t border-border bg-muted/20">
        <Link
          to="/app/support"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
          aria-label="View notifications and support"
        >
          <div className="relative">
            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full" aria-hidden="true" />
          </div>
          <span className="text-sm text-muted-foreground">View notifications</span>
        </Link>
      </div>
    </motion.div>
  );
}