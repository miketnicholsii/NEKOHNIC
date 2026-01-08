// UpgradeModalProvider - Global context for triggering upgrade modals from anywhere
// Per Engineering Standards: "Centralize business logic" - single source for upgrade flow

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Feature } from "@/lib/entitlements";
import { SubscriptionTier } from "@/lib/subscription-tiers";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { UpgradeModal } from "@/components/UpgradeModal";

// ============================================================================
// Types
// ============================================================================

interface UpgradeModalOptions {
  /** The feature user is trying to access */
  feature?: Feature;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Whether to show tier comparison */
  showTierComparison?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom callback when user clicks upgrade */
  onUpgrade?: () => void;
}

interface UpgradeModalContextValue {
  /** Open the upgrade modal */
  openUpgradeModal: (options?: UpgradeModalOptions) => void;
  /** Close the upgrade modal */
  closeUpgradeModal: () => void;
  /** Whether the modal is currently open */
  isOpen: boolean;
}

// ============================================================================
// Context
// ============================================================================

const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

interface UpgradeModalProviderProps {
  children: ReactNode;
}

export function UpgradeModalProvider({ children }: UpgradeModalProviderProps) {
  const { tier } = useSubscriptionTier();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UpgradeModalOptions>({});

  const openUpgradeModal = useCallback((opts: UpgradeModalOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsOpen(false);
    // Clear options after animation completes
    setTimeout(() => setOptions({}), 200);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      closeUpgradeModal();
    }
  }, [closeUpgradeModal]);

  const contextValue: UpgradeModalContextValue = {
    openUpgradeModal,
    closeUpgradeModal,
    isOpen,
  };

  return (
    <UpgradeModalContext.Provider value={contextValue}>
      {children}
      <UpgradeModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        feature={options.feature}
        title={options.title}
        description={options.description}
        currentTier={tier}
        showTierComparison={options.showTierComparison}
        ctaText={options.ctaText}
        onUpgrade={options.onUpgrade}
      />
    </UpgradeModalContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useUpgradeModal - Access the global upgrade modal from any component
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { openUpgradeModal } = useUpgradeModal();
 *   
 *   const handleClick = () => {
 *     openUpgradeModal({ 
 *       feature: "analytics_advanced",
 *       title: "Unlock Advanced Analytics"
 *     });
 *   };
 *   
 *   return <Button onClick={handleClick}>View Analytics</Button>;
 * }
 * ```
 */
export function useUpgradeModal(): UpgradeModalContextValue {
  const context = useContext(UpgradeModalContext);
  
  if (!context) {
    throw new Error(
      "useUpgradeModal must be used within an UpgradeModalProvider. " +
      "Wrap your app with <UpgradeModalProvider> in App.tsx or main.tsx."
    );
  }
  
  return context;
}

// ============================================================================
// Optional: Safe hook that doesn't throw (for components that may be outside provider)
// ============================================================================

/**
 * useUpgradeModalSafe - Safe version that returns null if outside provider
 * Use this when you're unsure if the provider is available
 */
export function useUpgradeModalSafe(): UpgradeModalContextValue | null {
  return useContext(UpgradeModalContext);
}

export default UpgradeModalProvider;
