"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/utils";

export default function CaseStudyReveal({
  as: Component = "div",
  className,
  children,
  delay = 0,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "motion-safe:translate-y-3 motion-safe:opacity-0 motion-safe:transition motion-safe:duration-300 motion-safe:ease-out",
        "motion-reduce:transition-none",
        isVisible && "motion-safe:translate-y-0 motion-safe:opacity-100",
        className
      )}
    >
      {children}
    </Component>
  );
}
