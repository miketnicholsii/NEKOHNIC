import { useEffect, useState, useRef, memo } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export const CursorGlow = memo(function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [isInHero, setIsInHero] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.1 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.1 });
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
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
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);
  
  if (prefersReducedMotion) return null;
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
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
    </div>
  );
});
