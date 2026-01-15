import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function DeleteAccountDialog() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<"warning" | "confirm">("warning");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setConfirmEmail("");
      setStep("warning");
    }
  };

  const handleProceedToConfirm = () => {
    setStep("confirm");
  };

  const handleDeleteAccount = async () => {
    if (!user?.email) {
      toast.error("Unable to verify your identity");
      return;
    }

    if (confirmEmail !== user.email) {
      toast.error("Email does not match. Please enter your email exactly.");
      return;
    }

    setIsDeleting(true);

    try {
      const { data, error } = await supabase.functions.invoke("delete-account", {
        body: { confirmEmail },
      });

      if (error) {
        throw new Error(error.message || "Failed to delete account");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Successfully deleted
      toast.success("Your account has been permanently deleted. We're sorry to see you go.");
      
      // Sign out and redirect to home
      await signOut();
      navigate("/", { replace: true });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete account";
      toast.error(message);
      console.error("Delete account error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {step === "warning" ? (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-3">
                <p>
                  This action is <strong>permanent and cannot be undone</strong>. 
                  All your data will be permanently deleted, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Your profile and business information</li>
                  <li>All tradelines and credit score records</li>
                  <li>Your digital CV and portfolio</li>
                  <li>Tasks, progress, and achievements</li>
                  <li>Subscription and billing history</li>
                  <li>Support tickets and communications</li>
                </ul>
                <p className="text-sm font-medium text-destructive">
                  This cannot be recovered. Please be certain.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button 
                variant="destructive" 
                onClick={handleProceedToConfirm}
              >
                I understand, continue
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-destructive/10">
                  <Trash2 className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle>Confirm account deletion</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                To confirm deletion, please type your email address exactly as shown:
                <code className="block mt-2 p-2 bg-muted rounded text-foreground font-mono text-sm">
                  {user?.email}
                </code>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="py-4">
              <Label htmlFor="confirm-email" className="sr-only">
                Confirm email
              </Label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="Enter your email to confirm"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                disabled={isDeleting}
                autoComplete="off"
                autoFocus
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmEmail !== user?.email}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Permanently Delete Account
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
