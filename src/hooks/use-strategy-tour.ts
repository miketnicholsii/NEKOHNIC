import { useEffect, useState } from "react";

const TOUR_STORAGE_KEY = "neko-strategy-tour-completed";

export function useStrategyTour() {
  const [showTour, setShowTour] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
    setHasChecked(true);
  }, []);

  const completeTour = () => {
    setShowTour(false);
    setHasChecked(true);
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowTour(true);
  };

  return { showTour, completeTour, resetTour, hasChecked };
}
