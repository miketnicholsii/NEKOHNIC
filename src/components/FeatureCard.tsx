import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = memo(function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className 
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative p-6 sm:p-7 lg:p-8 rounded-2xl bg-card border border-border",
        "transition-all duration-500 ease-out",
        "hover:border-primary/40 hover:shadow-lg",
        "focus-within:ring-2 focus-within:ring-primary/20",
        "glow-ring contain-layout",
        className
      )}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }}
    >
      {/* Subtle gradient overlay on hover */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        aria-hidden="true"
      />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Icon */}
      <div className="relative mb-5 sm:mb-6">
        <motion.div 
          className={cn(
            "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
            "bg-primary/10 text-primary",
            "transition-all duration-500 ease-out",
            "group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow"
          )}
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg sm:text-xl font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-400">
          {title}
        </h3>
        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover accent line - smoother animation */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary rounded-b-2xl origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden="true"
      />
    </motion.div>
  );
});
