import { useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isGoogleOAuthEnabled, isGithubOAuthEnabled } from "@/lib/auth-providers";
import { cn } from "@/lib/utils";

const isPresent = (value: string | undefined) => Boolean(value && value.trim().length > 0);

type Status = "ok" | "missing" | "disabled" | "attention";

type DiagnosticItem = {
  label: string;
  status: Status;
  description: string;
  action?: string;
  optional?: boolean;
};

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  ok: {
    label: "Configured",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/20 text-emerald-200",
  },
  missing: {
    label: "Missing",
    icon: XCircle,
    className: "border-rose-500/30 bg-rose-500/20 text-rose-200",
  },
  disabled: {
    label: "Disabled",
    icon: XCircle,
    className: "border-rose-500/30 bg-rose-500/20 text-rose-200",
  },
  attention: {
    label: "Verify",
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/20 text-amber-200",
  },
};

export default function Diagnostics() {
  const { toast } = useToast();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const publicEnvItems: DiagnosticItem[] = useMemo(
    () => [
      {
        label: "VITE_SUPABASE_URL",
        status: isPresent(supabaseUrl) ? "ok" : "missing",
        description: "Supabase project URL used by the web client.",
        action: "VITE_SUPABASE_URL=https://<project-ref>.supabase.co",
      },
      {
        label: "VITE_SUPABASE_PUBLISHABLE_KEY",
        status: isPresent(supabaseKey) ? "ok" : "missing",
        description: "Supabase anonymous/publishable key for client auth.",
        action: "VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>",
      },
    ],
    [supabaseUrl, supabaseKey],
  );

  const oauthItems: DiagnosticItem[] = [
    {
      label: "VITE_ENABLE_GOOGLE_OAUTH",
      status: isGoogleOAuthEnabled ? "ok" : "disabled",
      description: "Controls whether Google sign-in is shown in Login/Signup.",
      action: "VITE_ENABLE_GOOGLE_OAUTH=true",
    },
    {
      label: "VITE_ENABLE_GITHUB_OAUTH",
      status: isGithubOAuthEnabled ? "ok" : "disabled",
      description: "Optional toggle for future GitHub OAuth support.",
      action: "VITE_ENABLE_GITHUB_OAUTH=true",
      optional: true,
    },
  ];

  const backendSecrets: DiagnosticItem[] = [
    {
      label: "STRIPE_SECRET_KEY",
      status: "attention",
      description: "Required for billing-related Supabase Edge Functions.",
      action: "Add STRIPE_SECRET_KEY in Supabase project secrets.",
    },
    {
      label: "SUPABASE_SERVICE_ROLE_KEY",
      status: "attention",
      description: "Used by Edge Functions to access privileged tables.",
      action: "Add SUPABASE_SERVICE_ROLE_KEY in Supabase project secrets.",
    },
    {
      label: "RESEND_API_KEY",
      status: "attention",
      description: "Required for transactional emails (contact + delete account).",
      action: "Add RESEND_API_KEY in Supabase project secrets.",
    },
    {
      label: "TURNSTILE_SECRET_KEY",
      status: "attention",
      description: "Validates Turnstile challenges in contact-submit function.",
      action: "Add TURNSTILE_SECRET_KEY in Supabase project secrets.",
    },
  ];

  const handleCopy = async (text: string | undefined, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard.`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the value manually.",
        variant: "destructive",
      });
    }
  };

  const renderItems = (items: DiagnosticItem[]) => (
    <div className="space-y-4">
      {items.map((item) => {
        const config = statusConfig[item.status];
        const StatusIcon = config.icon;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary-foreground">{item.label}</h3>
                  {item.optional && (
                    <span className="text-xs text-primary-foreground/60">Optional</span>
                  )}
                </div>
                <p className="text-sm text-primary-foreground/60 mt-1">{item.description}</p>
              </div>
              <Badge
                variant="outline"
                className={cn("gap-1 border text-xs uppercase tracking-wide", config.className)}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {config.label}
              </Badge>
            </div>
            {item.action && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="rounded-md bg-background/40 px-2.5 py-1 text-xs text-primary-foreground">
                  {item.action}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary-foreground/70 hover:text-primary-foreground"
                  onClick={() => handleCopy(item.action, item.label)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-foreground">
          Setup / Diagnostics
        </h1>
        <p className="text-primary-foreground/60">
          Use this checklist to validate required configuration before enabling production auth.
        </p>
      </header>

      <Card className="border-primary-foreground/10 bg-primary-foreground/5">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Supabase Public Configuration</CardTitle>
        </CardHeader>
        <CardContent>{renderItems(publicEnvItems)}</CardContent>
      </Card>

      <Card className="border-primary-foreground/10 bg-primary-foreground/5">
        <CardHeader>
          <CardTitle className="text-primary-foreground">OAuth Providers</CardTitle>
        </CardHeader>
        <CardContent>
          {renderItems(oauthItems)}
          <p className="text-xs text-primary-foreground/60 mt-4">
            Providers must also be enabled in Supabase Auth settings to avoid redirect errors.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary-foreground/10 bg-primary-foreground/5">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Backend Secrets (Supabase Edge Functions)</CardTitle>
        </CardHeader>
        <CardContent>
          {renderItems(backendSecrets)}
          <p className="text-xs text-primary-foreground/60 mt-4">
            These secrets are validated by the Edge Functions at runtime. Verify them in the Supabase
            project settings under "Secrets".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
