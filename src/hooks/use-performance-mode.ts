import { useEffect, useMemo, useState } from "react";

interface PerformanceModeState {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number | null;
  isLowMemoryDevice: boolean;
  reduceMotion: boolean;
}

const getDeviceMemory = () => {
  if (typeof navigator === "undefined") return null;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof memory === "number" ? memory : null;
};

export function usePerformanceMode(): PerformanceModeState {
  const [state, setState] = useState<PerformanceModeState>(() => ({
    isMobile: false,
    prefersReducedMotion: false,
    deviceMemory: getDeviceMemory(),
    isLowMemoryDevice: false,
    reduceMotion: false,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const updateState = () => {
      const deviceMemory = getDeviceMemory();
      const prefersReducedMotion = reducedMotionQuery.matches;
      const isMobile = mobileQuery.matches;
      const isLowMemoryDevice = deviceMemory !== null ? deviceMemory <= 4 : false;
      const reduceMotion = prefersReducedMotion || isMobile || isLowMemoryDevice;

      setState({
        isMobile,
        prefersReducedMotion,
        deviceMemory,
        isLowMemoryDevice,
        reduceMotion,
      });
    };

    updateState();
    reducedMotionQuery.addEventListener("change", updateState);
    mobileQuery.addEventListener("change", updateState);
    window.addEventListener("resize", updateState, { passive: true });

    return () => {
      reducedMotionQuery.removeEventListener("change", updateState);
      mobileQuery.removeEventListener("change", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  return useMemo(() => state, [state]);
}
