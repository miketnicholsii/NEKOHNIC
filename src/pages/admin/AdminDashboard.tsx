import { motion } from "framer-motion";
import { Users, FileText, CreditCard, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "0", icon: Users, change: "+0%" },
  { label: "Resources", value: "0", icon: FileText, change: "+0%" },
  { label: "Active Plans", value: "0", icon: CreditCard, change: "+0%" },
  { label: "Conversions", value: "0%", icon: TrendingUp, change: "+0%" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-primary-foreground/60">
          Overview of your platform's performance.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            className="p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary-foreground/70" />
              </div>
              <span className="text-xs text-primary/80 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-primary-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-primary-foreground/60">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-8 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 text-center"
      >
        <p className="text-primary-foreground/60">
          Full admin functionality coming in Phase 5 & 6.
        </p>
      </motion.div>
    </div>
  );
}
