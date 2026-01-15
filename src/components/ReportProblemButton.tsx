import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";

interface ReportProblemButtonProps {
  variant?: "ghost" | "outline" | "link";
  size?: "sm" | "default" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function ReportProblemButton({
  variant = "ghost",
  size = "sm",
  className,
  showLabel = true,
}: ReportProblemButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error("Please describe the problem");
      return;
    }

    setIsSubmitting(true);

    // Build email content
    const subject = encodeURIComponent("Problem Report - NÈKO App");
    const logSummary = logger.getLogSummary();
    
    const body = encodeURIComponent(
      `Hi NÈKO Team,\n\n` +
      `I'd like to report a problem:\n\n` +
      `--- Description ---\n` +
      `${description}\n\n` +
      `--- Technical Details ---\n` +
      `Time: ${new Date().toISOString()}\n` +
      `URL: ${window.location.href}\n` +
      `User: ${user?.email || "Not logged in"}\n` +
      `Browser: ${navigator.userAgent.slice(0, 100)}\n\n` +
      `Recent Logs:\n${logSummary}\n`
    );

    // Open email client
    window.open(`mailto:support@helloneko.co?subject=${subject}&body=${body}`, "_blank");

    // Reset and close
    setDescription("");
    setIsOpen(false);
    setIsSubmitting(false);

    toast.success("Email client opened — please send the message to complete your report");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="Report a problem"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span className="ml-2">Report a Problem</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report a Problem</DialogTitle>
          <DialogDescription>
            Describe the issue you're experiencing and we'll look into it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="problem-description">What happened?</Label>
            <Textarea
              id="problem-description"
              placeholder="Describe what you were doing and what went wrong..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Opening..." : "Send Report"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This will open your email client with the report details.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportProblemButton;
