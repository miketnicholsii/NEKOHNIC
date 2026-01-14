import { ReactNode, useEffect, useRef, useState } from "react";

interface LazyMountProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  rootMargin?: string;
}

export function LazyMount({
  children,
  fallback,
  className,
  rootMargin = "400px 0px",
}: LazyMountProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={wrapperRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}
