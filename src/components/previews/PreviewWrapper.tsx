import { memo, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PreviewWrapperProps {
  children: ReactNode;
  expandedContent?: ReactNode;
  title: string;
  accentColor?: "primary" | "secondary";
}

const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: { repeat: Infinity, duration: 2, ease: "linear" as const }
};

export const PreviewWrapper = memo(function PreviewWrapper({ 
  children, 
  expandedContent,
  title,
  accentColor = "primary"
}: PreviewWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accentClasses = accentColor === "primary" 
    ? "from-primary/20 via-primary/10 to-secondary/20"
    : "from-secondary/20 via-secondary/10 to-primary/20";

  return (
    <>
      <motion.div
        className="relative cursor-pointer group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.015, y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Animated border glow */}
        <motion.div
          className={`absolute -inset-[2px] bg-gradient-to-r ${accentClasses} rounded-[18px] blur-md opacity-0 -z-10`}
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Subtle shimmer effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-2xl z-10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                {...shimmer}
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
              className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent rounded-2xl flex items-end justify-center pb-8 z-20"
            >
              <motion.div
                initial={{ y: 12, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 8, opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-xl shadow-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                See Full Demo
                <Maximize2 className="h-3.5 w-3.5 ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full Demo Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background border-border/50 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>{title} Demo</DialogTitle>
          </VisuallyHidden>
          
          {/* Modal Header with gradient */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-background via-background to-muted/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className={`w-10 h-10 rounded-xl bg-${accentColor}/10 flex items-center justify-center`}
              >
                <Sparkles className={`h-5 w-5 text-${accentColor}`} />
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
