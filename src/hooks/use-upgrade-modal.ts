import React from "react";
import type { Feature } from "@/lib/entitlements";

interface UseUpgradeModalReturn {
  isOpen: boolean;
  openModal: (feature?: Feature) => void;
  closeModal: () => void;
  modalProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feature: Feature | undefined;
  };
}

export const useUpgradeModal = (): UseUpgradeModalReturn => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [feature, setFeature] = React.useState<Feature | undefined>(undefined);

  const openModal = React.useCallback((feat?: Feature) => {
    setFeature(feat);
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps: {
      open: isOpen,
      onOpenChange: setIsOpen,
      feature,
    },
  };
};
