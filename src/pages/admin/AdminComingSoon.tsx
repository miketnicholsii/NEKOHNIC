import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface AdminComingSoonProps {
  title: string;
  description?: string;
}

export default function AdminComingSoon({ title, description }: AdminComingSoonProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
          <Construction className="h-10 w-10 text-primary-foreground/70" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
          {title}
        </h1>
        <p className="text-primary-foreground/60 max-w-md mx-auto">
          {description || "This feature is on the way. We're taking our time to get it right."}
        </p>
      </motion.div>
    </div>
  );
}
