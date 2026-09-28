"use client";

import { useEffect, type RefObject } from "react";

const targets = [
  ".section-heading", ".empathy-grid > *", ".empathy-summary",
  ".methods-grid > *", ".methods-summary", ".value-grid > *", ".value-note",
  ".step-grid > *", ".care-journey", ".privacy-heading", ".privacy-card-grid > *",
  ".privacy-bottom", ".inline-brief-heading", ".beta-fit-list > *", ".beta-fit-note",
  ".beta-process-grid > *", ".beta-process-note", ".beta-section > *", ".faq-list > *",
].join(",");

/** Progressive enhancement: content remains visible without JS or observer support. */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>(targets));
    const show = (element: Element) => {
      element.classList.add("is-visible");
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
    }, { threshold: 0, rootMargin: "0px 0px -24px" });
    const siblings = new Map<Element, number>();
    elements.forEach(element => {
      const parent = element.parentElement!;
      const index = siblings.get(parent) ?? 0;
      siblings.set(parent, index + 1);
      // Start each group together; long lists never accumulate a long wait.
      element.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 60}ms`);
      element.classList.add("scroll-reveal");
      if (element.getBoundingClientRect().top < window.innerHeight) show(element);
      else observer.observe(element);
    });
    const onPreferenceChange = () => {
      if (preference.matches) elements.forEach(show);
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      // A keyboard user should never focus an invisible link or FAQ summary.
      elements.filter(element => element.contains(event.target as Node)).forEach(show);
    };
    preference.addEventListener("change", onPreferenceChange);
    root.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      root.removeEventListener("focusin", onFocus);
      elements.forEach(element => {
        element.classList.remove("scroll-reveal", "is-visible");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [rootRef]);
}
