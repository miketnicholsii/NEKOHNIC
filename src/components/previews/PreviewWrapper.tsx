import { memo, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PreviewWrapperProps {
  children: ReactNode;
  expandedContent?: ReactNode;
  title: string;
}

export const PreviewWrapper = memo(function PreviewWrapper({ 
  children, 
  expandedContent,
  title 
}: PreviewWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative cursor-pointer group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Hover glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 rounded-3xl blur-xl opacity-0 -z-10"
          animate={{ opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {children}
        
        {/* Hover overlay with CTA */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent rounded-2xl flex items-end justify-center pb-8 z-20"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg"
              >
                <Maximize2 className="h-4 w-4" />
                See Full Demo
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full Demo Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background border-border">
          <VisuallyHidden>
            <DialogTitle>{title} Demo</DialogTitle>
          </VisuallyHidden>
          
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">Full dashboard preview</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            {expandedContent || children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
