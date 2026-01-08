import { memo } from "react";

// Simplified - cursor glow disabled for performance
// This was causing continuous re-renders on mouse movement
export const CursorGlow = memo(function CursorGlow() {
  return null;
});