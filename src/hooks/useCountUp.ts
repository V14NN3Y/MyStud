import { useEffect, useRef, useState } from "react";
interface UseCountUpOptions {
  /** Final numeric value to count up to. */
  target: number;
  /** Number of decimals kept while animating. */
  decimals?: number;
  /** Animation duration in milliseconds. */
  duration?: number;
}
const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);
/**
 * Animates a number from 0 to its target the first time the element enters
 * the viewport. Re-runs whenever the target changes (e.g. filtering the scope
 * on the ministry dashboard), and falls back to the final value instantly when
 * the user prefers reduced motion.
 */
export default function useCountUp({ target, decimals = 0, duration = 1600 }: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const hasPlayed = useRef(false);
  // Reset whenever the target changes so the count-up replays with new data.
  useEffect(() => {
    hasPlayed.current = false;
    setValue(0);
  }, [target, decimals]);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      hasPlayed.current = true;
      setValue(target);
      return undefined;
    }
    let frame = 0;
    let startTime = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasPlayed.current) return;
          hasPlayed.current = true;
          startTime = performance.now();
          frame = requestAnimationFrame(tick);
          observer.disconnect();
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);
  return { ref, value, decimals } as const;
}
