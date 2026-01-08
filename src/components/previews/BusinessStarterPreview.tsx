import { memo } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Building2, 
  FileText, 
  Landmark, 
  Phone, 
  Mail,
  ArrowRight,
  Download,
  ExternalLink,
  Clock,
  Sparkles
} from "lucide-react";
import { PreviewWrapper } from "./PreviewWrapper";

const steps = [
  { icon: Building2, title: "Registered Business", complete: true, time: "2 days ago" },
  { icon: FileText, title: "EIN Number", complete: true, time: "Yesterday" },
  { icon: Landmark, title: "Business Bank Account", complete: false, current: true },
  { icon: Phone, title: "Business Phone", complete: false },
  { icon: Mail, title: "Professional Email", complete: false },
];

const checklist = [
  { text: "Gather required documents (EIN letter, formation docs, ID)", checked: true },
  { text: "Research banks with good small business features", checked: true },
  { text: "Compare fees, minimum balances, and features", checked: false },
  { text: "Open the account in person or online", checked: false },
];

const expandedChecklist = [
  { text: "Gather required documents (EIN letter, formation docs, ID)", checked: true },
  { text: "Research banks with good small business features", checked: true },
  { text: "Compare fees, minimum balances, and features", checked: false },
  { text: "Open the account in person or online", checked: false },
  { text: "Set up online banking and mobile app", checked: false },
  { text: "Order business checks and debit card", checked: false },
  { text: "Set up automatic transfers from personal if needed", checked: false },
];

const resources = [
  { title: "LLC Formation Guide", type: "PDF", icon: Download, color: "bg-primary/10 text-primary" },
  { title: "EIN Application Walkthrough", type: "Video", icon: ExternalLink, color: "bg-secondary/10 text-secondary" },
  { title: "Bank Comparison Chart", type: "Sheet", icon: Download, color: "bg-accent/10 text-accent-foreground" },
];

const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

function PreviewContent({ showOverlay = true }: { showOverlay?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-xl">
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      <div className="p-5 sm:p-6">
        {/* Header with animated progress */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
            >
              <Building2 className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">Business Starter</h3>
              <p className="text-xs text-muted-foreground">2 of 5 steps completed</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-bold text-primary">40%</span>
            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
          {/* Step Navigation */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {steps.map((step) => (
              <motion.div
                key={step.title}
                variants={staggerItem}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                  step.current 
                    ? "bg-primary/10 border-2 border-primary/40 shadow-sm" 
                    : step.complete 
                      ? "bg-muted/50 border border-border"
                      : "border border-transparent opacity-50"
                }`}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.complete 
                      ? "bg-primary text-primary-foreground" 
                      : step.current
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.complete ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <step.icon className="h-3.5 w-3.5" />
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <span className={`font-medium truncate block ${step.current ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                  {step.complete && step.time && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {step.time}
                    </span>
                  )}
                </div>
                {step.current && (
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Current Step Detail */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-2 ring-primary/20">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Business Bank Account</h4>
                <p className="text-xs text-muted-foreground">Separate your finances</p>
              </div>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {checklist.map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className={`flex items-start gap-2.5 p-3 rounded-lg text-xs transition-all ${
                    item.checked 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-muted/30 border border-border hover:border-muted-foreground/20"
                  }`}
                >
                  {item.checked ? (
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={item.checked ? "text-foreground" : "text-muted-foreground"}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ExpandedContent() {
  return (
    <div className="space-y-6">
      {/* Full Progress Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">Business Starter Kit</h3>
            <p className="text-sm text-muted-foreground">Complete foundation for your business</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">40%</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-primary to-primary/70"
              />
            </div>
            <span className="text-xs text-muted-foreground">2 of 5</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Full Step Navigation */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all cursor-pointer ${
                step.current 
                  ? "bg-primary/10 border-2 border-primary shadow-md shadow-primary/10" 
                  : step.complete 
                    ? "bg-muted/50 border border-border hover:bg-muted"
                    : "border border-border opacity-60 hover:opacity-80"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                step.complete 
                  ? "bg-primary text-primary-foreground" 
                  : step.current
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}>
                {step.complete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <span className={`font-medium ${step.current ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
                {step.complete && step.time && (
                  <p className="text-xs text-muted-foreground">{step.time}</p>
                )}
              </div>
              {step.current && <ArrowRight className="h-4 w-4 text-primary" />}
            </motion.div>
          ))}
        </motion.div>

        {/* Expanded Step Content */}
        <div className="space-y-5">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-2 ring-primary/20">
                <Landmark className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-foreground">Business Bank Account</h4>
                <p className="text-sm text-muted-foreground">Separate your personal and business finances</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expandedChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl text-sm cursor-pointer ${
                    item.checked 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-muted/30 border border-border hover:border-muted-foreground/30"
                  }`}
                >
                  {item.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={item.checked ? "text-foreground" : "text-muted-foreground"}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h5 className="font-semibold text-foreground">Helpful Resources</h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group border border-transparent hover:border-border"
                >
                  <div className={`w-10 h-10 rounded-lg ${resource.color} flex items-center justify-center`}>
                    <resource.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const BusinessStarterPreview = memo(function BusinessStarterPreview() {
  return (
    <PreviewWrapper title="Business Starter" expandedContent={<ExpandedContent />}>
      <PreviewContent />
    </PreviewWrapper>
  );
});
