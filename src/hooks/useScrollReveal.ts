import { useEffect } from "react";
const SELECTOR = ".animate-fade-up, .animate-scale-in, .reveal";
let observer: IntersectionObserver | null = null;
if (typeof window !== "undefined" && typeof IntersectionObserver !== "undefined") {
  document.documentElement.classList.add("reveal-enabled");
}
function markVisible(element: Element) {
  element.classList.add("is-inview");
  observer?.unobserve(element);
}
function scanForReveals() {
  const nodes = document.querySelectorAll(SELECTOR);
  nodes.forEach((node) => {
    const element = node as HTMLElement;
    if (element.dataset.revealBound === "1") return;
    element.dataset.revealBound = "1";
    if (!observer) {
      markVisible(element);
      return;
    }
    observer.observe(element);
  });
}
/**
 * Activates scroll-triggered entrance animations across the whole site.
 * Elements animate in the first time they enter the viewport, and any element
 * rendered later (filters, panels, lists) is picked up automatically.
 */
export default function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) markVisible(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    scanForReveals();
    let pending = 0;
    const mutation = new MutationObserver(() => {
      window.clearTimeout(pending);
      pending = window.setTimeout(scanForReveals, 60);
    });
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(pending);
      mutation.disconnect();
      observer?.disconnect();
      observer = null;
      // React StrictMode mounts, cleans up, then mounts again: the observer created on
      // the first mount is disconnected before it can notify elements already in the
      // viewport. Clearing the guard lets the next mount's scanForReveals re-observe
      // them instead of skipping them forever.
      document.querySelectorAll(SELECTOR).forEach((node) => {
        delete (node as HTMLElement).dataset.revealBound;
      });
    };
  }, []);
}
