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

export const staggerItem = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

// Additional animation variants for more complex effects
export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const slideInFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Blur-in animation for hero sections
export const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Slide up with rotation for cards
export const slideUpRotate = {
  hidden: { opacity: 0, y: 30, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Gentle float animation
export const gentleFloat = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Scale from center
export const scaleFromCenter = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // spring-like
    },
  },
};
