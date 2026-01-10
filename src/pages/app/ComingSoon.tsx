import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Construction className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {description || "This feature is on the way. We're taking our time to get it right for you."}
        </p>
        <Link to="/app">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
