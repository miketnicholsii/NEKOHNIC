import { useContext } from "react";
import { UpgradeModalContext, UpgradeModalContextValue } from "@/contexts/upgrade-modal-context";

/**
 * useUpgradeModal - Access the global upgrade modal from any component
 */
export function useUpgradeModal(): UpgradeModalContextValue {
  const context = useContext(UpgradeModalContext);

  if (!context) {
    throw new Error(
      "useUpgradeModal must be used within an UpgradeModalProvider. " +
        "Wrap your app with <UpgradeModalProvider> in App.tsx or main.tsx.",
    );
  }

  return context;
}

/**
 * useUpgradeModalSafe - Safe version that returns null if outside provider
 * Use this when you're unsure if the provider is available
 */
export function useUpgradeModalSafe(): UpgradeModalContextValue | null {
  return useContext(UpgradeModalContext);
}
