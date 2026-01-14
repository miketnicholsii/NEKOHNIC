import { motion, useInView, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useRef, ReactNode, memo, useMemo } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  amount?: number;
}

const directionVariants = {
  up: { y: 16, opacity: 0 },
  down: { y: -16, opacity: 0 },
  left: { x: 16, opacity: 0 },
  right: { x: -16, opacity: 0 },
  none: { opacity: 0 },
};

const visible = { x: 0, y: 0, opacity: 1 };

// Faster, simpler easing
const smoothEase = [0.4, 0, 0.2, 1] as const;

export const AnimatedSection = memo(function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.15,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px 0px", amount });
  const prefersReducedMotion = useFramerReducedMotion();

  const variants = useMemo(() => ({
    hidden: directionVariants[direction],
    visible: visible,
  }), [direction]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: 0.35,
        delay: Math.min(delay, 0.3), // Cap delay to prevent long waits
        ease: smoothEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

interface AnimatedStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export const AnimatedStagger = memo(function AnimatedStagger({
  children,
  className = "",
  staggerDelay = 0.08,
  once = true,
}: AnimatedStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-30px 0px", amount: 0.1 });
  const prefersReducedMotion = useFramerReducedMotion();

  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  }), [staggerDelay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
});

