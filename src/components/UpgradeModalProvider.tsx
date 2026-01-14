// UpgradeModalProvider - Global context for triggering upgrade modals from anywhere
// Per Engineering Standards: "Centralize business logic" - single source for upgrade flow

import React, { useState, useCallback, ReactNode } from "react";
import { useSubscriptionTier } from "@/hooks/use-subscription-tier";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  UpgradeModalContext,
  UpgradeModalContextValue,
  UpgradeModalOptions,
} from "@/contexts/upgrade-modal-context";

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

export default UpgradeModalProvider;
