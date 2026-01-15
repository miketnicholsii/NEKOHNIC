import { motion, useInView, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useRef, ReactNode, memo, useMemo, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none" | "scale" | "blur";
  once?: boolean;
  amount?: number;
  duration?: number;
}

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const getVariants = (direction: string) => {
  switch (direction) {
    case "up":
      return {
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };
    case "down":
      return {
        hidden: { y: -40, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };
    case "left":
      return {
        hidden: { x: -60, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      };
    case "right":
      return {
        hidden: { x: 60, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      };
    case "scale":
      return {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
      };
    case "none":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

export const AnimatedSection = memo(function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
  amount = 0.2,
  duration = 0.6,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px 0px", amount });
  const prefersReducedMotion = useFramerReducedMotion();

  const variants = useMemo(() => getVariants(direction), [direction]);

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
        duration,
        delay: Math.min(delay, 0.4),
        ease: easeOutExpo,
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
  staggerDelay = 0.1,
  once = true,
}: AnimatedStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px 0px", amount: 0.15 });
  const prefersReducedMotion = useFramerReducedMotion();

  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
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

// Section reveal with decorative line animation
interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  showLine?: boolean;
  linePosition?: "top" | "left";
}

export const SectionReveal = memo(function SectionReveal({
  children,
  className = "",
  showLine = true,
  linePosition = "top",
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px", amount: 0.1 });
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {showLine && linePosition === "top" && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
        />
      )}
      {showLine && linePosition === "left" && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent origin-top"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.15, ease: easeOutExpo }}
      >
        {children}
      </motion.div>
    </div>
  );
});

// Fade-in text reveal for headings
interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const TextReveal = memo(function TextReveal({
  children,
  className = "",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(4px)" }}
      transition={{ duration: 0.5, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = memo(function AnimatedCounter({
  value,
  duration = 1.5,
  className = "",
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useFramerReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
});

// Parallax container for depth effects
interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export const ParallaxContainer = memo(function ParallaxContainer({
  children,
  className = "",
}: ParallaxContainerProps) {
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
});

// Slide-in card animation
interface SlideInCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right";
}

export const SlideInCard = memo(function SlideInCard({
  children,
  className = "",
  delay = 0,
  direction = "left",
}: SlideInCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const xOffset = direction === "left" ? -80 : 80;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xOffset, rotateY: direction === "left" ? 10 : -10 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: xOffset, rotateY: direction === "left" ? 10 : -10 }}
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
      className={className}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
});

// Pop-in animation for emphasis
interface PopInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const PopIn = memo(function PopIn({
  children,
  className = "",
  delay = 0,
}: PopInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px 0px" });
  const prefersReducedMotion = useFramerReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.34, 1.56, 0.64, 1] // Spring-like ease
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});
