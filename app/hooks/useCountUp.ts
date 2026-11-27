import { useEffect, useRef, useState } from "react";
import { formatViNumber } from "~/lib/format";
import { useReducedMotion } from "./useMotion";

type CountUpOptions = {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  fallbackDisplay: string;
};

export const useCountUp = ({
  value,
  decimals,
  prefix,
  suffix,
  fallbackDisplay,
}: CountUpOptions): { ref: React.RefObject<HTMLElement | null>; text: string } => {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [text, setText] = useState(fallbackDisplay);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setText(fallbackDisplay);
      return;
    }

    const node = ref.current;
    if (!node || startedRef.current) return;

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue;
          startedRef.current = true;
          observer.unobserve(node);

          const startTime = performance.now();
          const duration = 1500;

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            if (progress >= 1) {
              setText(fallbackDisplay);
            } else {
              setText(formatViNumber(value * eased, decimals, prefix, suffix));
              rafId = requestAnimationFrame(tick);
            }
          };

          rafId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, decimals, prefix, suffix, fallbackDisplay, reduced]);

  return { ref, text };
};
