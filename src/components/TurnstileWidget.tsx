import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

// Turnstile site key - set to empty to use bypass mode
// Replace with your actual site key from Cloudflare dashboard when ready
const TURNSTILE_SITE_KEY = ""; // Empty = bypass mode for testing

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onVerify, onExpire, onError }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const isRenderedRef = useRef(false);
    const bypassCalledRef = useRef(false);

    // Bypass mode when no site key is configured
    const isBypassMode = !TURNSTILE_SITE_KEY;

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile || isRenderedRef.current) return;

      // Clear any existing widget
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore removal errors
        }
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
        theme: "auto",
        size: "normal",
      });
      isRenderedRef.current = true;
    }, [onVerify, onExpire, onError]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (isBypassMode) {
          bypassCalledRef.current = false;
          // Re-trigger bypass after a short delay
          setTimeout(() => {
            if (!bypassCalledRef.current) {
              bypassCalledRef.current = true;
              onVerify("bypass-for-testing");
            }
          }, 100);
        } else if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    useEffect(() => {
      // If in bypass mode, auto-verify immediately
      if (isBypassMode) {
        if (!bypassCalledRef.current) {
          bypassCalledRef.current = true;
          // Small delay to ensure component is mounted
          const timer = setTimeout(() => {
            onVerify("bypass-for-testing");
          }, 100);
          return () => clearTimeout(timer);
        }
        return;
      }

      // Check if script is already loaded
      if (window.turnstile) {
        renderWidget();
        return;
      }

      // Load the Turnstile script
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript) {
        // Script exists but turnstile not ready yet, wait for it
        window.onTurnstileLoad = renderWidget;
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;

      window.onTurnstileLoad = renderWidget;

      document.head.appendChild(script);

      return () => {
        isRenderedRef.current = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (e) {
            // Ignore removal errors
          }
        }
      };
    }, [renderWidget, isBypassMode, onVerify]);

    // Show bypass indicator when in testing mode
    if (isBypassMode) {
      return (
        <div 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary"
          aria-label="Security verification bypassed for testing"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Security check passed (test mode)</span>
        </div>
      );
    }

    return (
      <div 
        ref={containerRef} 
        className="flex justify-center min-h-[65px]"
        aria-label="Security verification"
      />
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
