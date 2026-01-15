import { memo, useState, ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Maximize2, X, Sparkles, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface PreviewWrapperProps {
  children: ReactNode;
  expandedContent?: ReactNode;
  title: string;
  accentColor?: "primary" | "secondary" | "accent";
}

export const PreviewWrapper = memo(function PreviewWrapper({ 
  children, 
  expandedContent,
  title,
  accentColor = "primary"
}: PreviewWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const performanceMode = usePerformanceMode();
  const shouldReduceMotion = prefersReducedMotion || performanceMode.reduceMotion;
  const hoverTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 400, damping: 25 };

  const accentGradients = {
    primary: "from-primary/30 via-primary/15 to-primary/5",
    secondary: "from-secondary/30 via-secondary/15 to-secondary/5",
    accent: "from-accent-gold/30 via-accent-gold/15 to-accent-gold/5"
  };

  const accentBorders = {
    primary: "border-primary/40",
    secondary: "border-secondary/40",
    accent: "border-accent-gold/40"
  };

  return (
    <>
      <motion.div
        className="relative cursor-pointer group"
        onHoverStart={() => !shouldReduceMotion && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={hoverTransition}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Animated border glow - NEKO branded */}
        <motion.div
          className={`absolute -inset-[3px] bg-gradient-to-br ${accentGradients[accentColor]} rounded-[20px] blur-lg -z-10`}
          animate={{ 
            opacity: isHovered ? 0.9 : 0,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
        />
        
        {/* Outer glow ring */}
        <motion.div
          className={`absolute -inset-[1px] rounded-[18px] border-2 ${accentBorders[accentColor]} -z-10`}
          animate={{ 
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.3 }}
        />
        
        {/* Subtle shimmer effect on hover */}
        <AnimatePresence>
          {isHovered && !shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-2xl z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: shouldReduceMotion ? 0.8 : 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {children}
        
        {/* Hover overlay with CTA */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-gradient-to-t from-background/98 via-background/60 to-transparent rounded-2xl flex items-end justify-center pb-10 z-20"
            >
              <motion.div
                initial={{ y: 16, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-semibold shadow-xl shadow-primary/25"
              >
                <Play className="h-4 w-4 fill-current" />
                See Full Demo
                <Maximize2 className="h-3.5 w-3.5 ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Always visible play indicator */}
        <motion.div
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground"
          animate={{ opacity: isHovered ? 0 : 1 }}
        >
          <Play className="h-3 w-3 fill-current" />
          Demo
        </motion.div>
      </motion.div>

      {/* Full Demo Modal - Mobile optimized */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background border-border/50 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{title} Demo</DialogTitle>
          </VisuallyHidden>
          
          {/* Modal Header with gradient */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-gradient-to-r from-background via-background to-muted/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">Full dashboard preview</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setIsModalOpen(false)}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          </div>
          
          {/* Modal Content with animation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-6"
          >
            {expandedContent || children}
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
});
