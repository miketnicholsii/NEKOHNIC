import { useEffect, useState, useRef, memo, useCallback } from "react";
import { motion, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// Check if device is touch-only
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const CursorGlow = memo(function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [isInHero, setIsInHero] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);
  
  const mouseX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.1 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.1 });
  
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);
  
  
  const handleClick = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion || isTouch) return;
    
    const hero = containerRef.current?.parentElement;
    if (!hero) return;
    
    const rect = hero.getBoundingClientRect();
    const isInside = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    
    if (isInside) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;
      
      setRipples(prev => [...prev, { id, x, y }]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 800);
    }
  }, [prefersReducedMotion, isTouch]);
  
  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const hero = containerRef.current?.parentElement;
      if (!hero) return;
      
      const rect = hero.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      setIsInHero(isInside);
      
      if (isInside) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [mouseX, mouseY, prefersReducedMotion, handleClick, isTouch]);
  
  // Don't render on touch devices or with reduced motion
  if (prefersReducedMotion || isTouch) return null;
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Cursor glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.05) 30%, transparent 70%)",
          opacity: isInHero ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />
      {/* Secondary smaller glow for more intensity at cursor */}
      <motion.div
        className="absolute w-[150px] h-[150px] rounded-full pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
          opacity: isInHero ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />
      
      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none border border-primary/40"
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ 
              width: 0, 
              height: 0, 
              opacity: 0.6,
            }}
            animate={{ 
              width: 300, 
              height: 300, 
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
