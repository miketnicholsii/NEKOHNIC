// FeatureGate Component
// Provides consistent, declarative feature access control throughout the app
// Per Engineering Standards: "All access decisions must be based on entitlements"

import { ReactNode, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeatureAccess, useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { Feature } from "@/lib/entitlements";
import { UpgradeModal } from "@/components/UpgradeModal";
import { cn } from "@/lib/utils";

interface FeatureGateProps {
  /**
   * The feature to check access for
   */
  feature: Feature;
  /**
   * Content to render when user has access
   */
  children: ReactNode;
  /**
   * Optional custom fallback when access is denied
   * If not provided, a default locked UI is shown
   */
  fallback?: ReactNode;
  /**
   * If true, renders nothing when locked (useful for hiding elements entirely)
   */
  hideWhenLocked?: boolean;
  /**
   * Custom title for the locked state
   */
  lockedTitle?: string;
  /**
   * Custom description for the locked state
   */
  lockedDescription?: string;
  /**
   * Whether to show the upgrade CTA
   * @default true
   */
  showUpgradeCTA?: boolean;
  /**
   * Visual style of the locked state
   * @default "card"
   */
  lockedStyle?: "card" | "inline" | "overlay";
  /**
   * Whether clicking on locked content opens the upgrade modal
   * @default true
   */
  openModalOnClick?: boolean;
  /**
   * Additional className for the wrapper
   */
  className?: string;
}

/**
 * FeatureGate - Declarative feature access control
 * 
 * Use this component to gate features based on subscription tier.
 * It automatically handles:
 * - Access checking via entitlements
 * - Admin preview mode (shows content but marks it as preview)
 * - Consistent locked UI with upgrade messaging
 * - UpgradeModal integration for locked features
 * 
 * @example
 * ```tsx
 * <FeatureGate feature="digital_cv_editor">
 *   <CVEditor />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  feature,
  children,
  fallback,
  hideWhenLocked = false,
  lockedTitle,
  lockedDescription,
  showUpgradeCTA = true,
  lockedStyle = "card",
  openModalOnClick = true,
  className,
}: FeatureGateProps) {
  const { hasAccess, upgradeMessage, isPreviewMode } = useFeatureAccess(feature);
  const { tier } = useSubscriptionTier();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLockedClick = useCallback(() => {
    if (openModalOnClick) {
      setIsModalOpen(true);
    }
  }, [openModalOnClick]);

  // User has access (or is in admin preview mode)
  if (hasAccess) {
    // If admin preview, wrap with preview indicator
    if (isPreviewMode) {
      return (
        <div className={cn("relative", className)}>
          <div className="absolute -top-2 -right-2 z-10">
            <Badge 
              variant="outline" 
              className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 text-[10px] px-1.5 py-0.5"
            >
              Preview Mode
            </Badge>
          </div>
          {children}
        </div>
      );
    }
    return <>{children}</>;
  }

  // User doesn't have access

  // If hideWhenLocked, render nothing
  if (hideWhenLocked) {
    return null;
  }

  // If custom fallback provided, use it (but still add modal)
  if (fallback) {
    return (
      <>
        <div onClick={handleLockedClick} className="cursor-pointer">
          {fallback}
        </div>
        <UpgradeModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          feature={feature}
          currentTier={tier}
        />
      </>
    );
  }

  // Default locked UI based on style
  const title = lockedTitle || "Feature Locked";
  const description = lockedDescription || upgradeMessage || "Upgrade your plan to access this feature.";

  const renderModal = () => (
    <UpgradeModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      feature={feature}
      title={lockedTitle}
      description={lockedDescription}
      currentTier={tier}
    />
  );

  if (lockedStyle === "inline") {
    return (
      <>
        <div 
          className={cn(
            "flex items-center gap-2 text-muted-foreground",
            openModalOnClick && "cursor-pointer hover:text-foreground transition-colors",
            className
          )}
          onClick={handleLockedClick}
          role={openModalOnClick ? "button" : undefined}
          tabIndex={openModalOnClick ? 0 : undefined}
          onKeyDown={openModalOnClick ? (e) => e.key === "Enter" && handleLockedClick() : undefined}
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">{description}</span>
          {showUpgradeCTA && !openModalOnClick && (
            <Link to="/pricing" className="text-primary hover:underline text-sm font-medium">
              Upgrade
            </Link>
          )}
          {showUpgradeCTA && openModalOnClick && (
            <span className="text-primary text-sm font-medium">
              Upgrade
            </span>
          )}
        </div>
        {renderModal()}
      </>
    );
  }

  if (lockedStyle === "overlay") {
    return (
      <>
        <div 
          className={cn("relative", openModalOnClick && "cursor-pointer", className)}
          onClick={handleLockedClick}
          role={openModalOnClick ? "button" : undefined}
          tabIndex={openModalOnClick ? 0 : undefined}
          onKeyDown={openModalOnClick ? (e) => e.key === "Enter" && handleLockedClick() : undefined}
        >
          {/* Blurred/dimmed content */}
          <div className="opacity-30 blur-[2px] pointer-events-none select-none" aria-hidden="true">
            {children}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">{description}</p>
              {showUpgradeCTA && (
                <Button variant="cta" size="sm">
                  Unlock Feature
                  <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
        {renderModal()}
      </>
    );
  }

  // Default: card style
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(openModalOnClick && "cursor-pointer", className)}
        onClick={handleLockedClick}
        role={openModalOnClick ? "button" : undefined}
        tabIndex={openModalOnClick ? 0 : undefined}
        onKeyDown={openModalOnClick ? (e) => e.key === "Enter" && handleLockedClick() : undefined}
      >
        <Card className="border-dashed border-muted-foreground/30 bg-muted/30 hover:border-primary/30 hover:bg-muted/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
            {showUpgradeCTA && (
              <Button variant="outline" size="sm">
                View Plans
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
      {renderModal()}
    </>
  );
}

/**
 * useFeatureGate - Hook version for programmatic access control
 * 
 * Use when you need to conditionally render based on feature access
 * without the declarative component wrapper.
 * 
 * @example
 * ```tsx
 * const { hasAccess, upgradeMessage } = useFeatureGate("analytics_advanced");
 * if (!hasAccess) {
 *   return <UpgradePrompt message={upgradeMessage} />;
 * }
 * ```
 */
export function useFeatureGate(feature: Feature) {
  return useFeatureAccess(feature);
}

/**
 * RequireFeature - Strict feature gate that renders nothing or fallback when locked
 * 
 * Stricter version of FeatureGate for cases where you want to completely
 * hide content rather than show a locked state.
 * 
 * @example
 * ```tsx
 * <RequireFeature feature="admin_preview">
 *   <AdminOnlyButton />
 * </RequireFeature>
 * ```
 */
export function RequireFeature({
  feature,
  children,
  fallback = null,
}: {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasAccess } = useFeatureAccess(feature);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * TierBadge - Displays the required tier for a feature
 * 
 * Useful for showing tier requirements inline with feature descriptions.
 * 
 * @example
 * ```tsx
 * <TierBadge feature="analytics_advanced" />
 * // Renders: "Elite"
 * ```
 */
export function TierBadge({ 
  feature,
  className,
}: { 
  feature: Feature;
  className?: string;
}) {
  const { hasAccess } = useFeatureAccess(feature);
  
  return (
    <Badge 
      variant={hasAccess ? "secondary" : "outline"}
      className={cn(
        "text-xs",
        hasAccess 
          ? "bg-primary/10 text-primary" 
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {hasAccess ? "Included" : `Requires upgrade`}
    </Badge>
  );
}
