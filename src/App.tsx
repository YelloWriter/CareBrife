"use client";

import { Brand } from "./components/landing/shared";
import FAQSection from "./components/landing/FAQSection";
import CTASection from "./components/landing/CTASection";
import BetaProcessSection from "./components/landing/BetaProcessSection";
import BetaFitSection from "./components/landing/BetaFitSection";
import CreateReportSection from "./components/landing/CreateReportSection";
import PrivacySection from "./components/landing/PrivacySection";
import HowItWorksSection from "./components/landing/HowItWorksSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import MethodsSection from "./components/landing/MethodsSection";
import EmpathySection from "./components/landing/EmpathySection";
import HeroSection from "./components/landing/HeroSection";

import { useEffect, useRef, useState } from "react";
import {
  isInterfaceTextVariant,
  languageOptions,
  normalizeInterfaceText,
  translateInterfaceText,
} from "./i18n";
import type { Language } from "./i18n";

const getLanguageFromLocation = (): Language => {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (
    queryLanguage === "ko" ||
    queryLanguage === "en"
  ) {
    return queryLanguage;
  }

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const pathLanguage = pathParts[pathParts.length - 1];
  return pathLanguage === "en" ? pathLanguage : "ko";
};
function App({ initialLanguage = "ko" }: { initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const appRef = useRef<HTMLDivElement>(null);
  const originalTextNodesRef = useRef(new WeakMap<Text, string>());
  const originalAttributesRef = useRef(new WeakMap<Element, Record<string, string>>());
  const changeLanguage = (nextLanguage: Language) => {
    if (nextLanguage !== language) window.location.assign(nextLanguage === "ko" ? "/" : "/en/");
  };

  useEffect(() => {
    const handleHistoryChange = () => setLanguage(getLanguageFromLocation());
    window.addEventListener("popstate", handleHistoryChange);
    return () => window.removeEventListener("popstate", handleHistoryChange);
  }, []);

  useEffect(() => {
    const root = appRef.current;
    if (!root) return;

    const htmlLanguage =
      languageOptions.find((option) => option.code === language)?.htmlLang ??
      "ko";
    document.documentElement.lang = htmlLanguage;


    let animationFrame = 0;
    const translatePage = () => {
      animationFrame = 0;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode();

      while (currentNode) {
        const textNode = currentNode as Text;
        const parent = textNode.parentElement;
        if (
          parent &&
          !parent.closest("[data-i18n-skip]") &&
          !["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)
        ) {
          const currentValue = textNode.nodeValue ?? "";
          let originalValue = originalTextNodesRef.current.get(textNode);
          if (
            originalValue === undefined ||
            !isInterfaceTextVariant(originalValue, currentValue)
          ) {
            originalValue = currentValue;
            originalTextNodesRef.current.set(textNode, originalValue);
          }

          const normalized = normalizeInterfaceText(originalValue);
          if (normalized) {
            const translated =
              language === "ko"
                ? originalValue
                : translateInterfaceText(normalized, language);
            const leading = originalValue.match(/^\s*/)?.[0] ?? "";
            const trailing = originalValue.match(/\s*$/)?.[0] ?? "";
            const nextValue =
              language === "ko"
                ? originalValue
                : `${leading}${translated}${trailing}`;
            if (textNode.nodeValue !== nextValue) {
              textNode.nodeValue = nextValue;
            }
          }
        }
        currentNode = walker.nextNode();
      }

      root
        .querySelectorAll<HTMLElement>(
          "[placeholder], [title], [aria-label]",
        )
        .forEach((element) => {
          if (element.closest("[data-i18n-skip]")) return;
          const stored =
            originalAttributesRef.current.get(element) ??
            ({} as Record<string, string>);

          ["placeholder", "title", "aria-label"].forEach((attribute) => {
            const currentValue = element.getAttribute(attribute);
            if (!currentValue) return;
            if (
              stored[attribute] === undefined ||
              !isInterfaceTextVariant(stored[attribute], currentValue)
            ) {
              stored[attribute] = currentValue;
            }
            const originalValue = stored[attribute];
            const translated =
              language === "ko"
                ? originalValue
                : translateInterfaceText(originalValue, language);
            if (currentValue !== translated) {
              element.setAttribute(attribute, translated);
            }
          });

          originalAttributesRef.current.set(element, stored);
        });
    };

    const scheduleTranslation = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(translatePage);
    };

    translatePage();
    const observer = new MutationObserver(scheduleTranslation);
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => {
      observer.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [language]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          ".section-heading",
          ".empathy-grid > *",
          ".empathy-summary",
          ".methods-grid > *",
          ".methods-summary",
          ".value-grid > *",
          ".value-note",
          ".step-grid > *",
          ".care-journey",
          ".privacy-heading",
          ".privacy-card-grid > *",
          ".privacy-bottom",
          ".workspace-heading",
          ".story-input-card",
          ".workspace-beta-card",
          ".form-card",
          ".preview-pane",
          ".beta-fit-list > *",
          ".beta-fit-note",
          ".beta-process-grid > *",
          ".beta-process-note",
          ".beta-section > *",
          ".faq-list > *",
        ].join(","),
      ),
    );

    revealTargets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${(index % 5) * 65}ms`);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -44px" },
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const progress = document.querySelector<HTMLElement>(
      ".scroll-progress > span",
    );
    if (!progress) return;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div className={`app app-language-${language}`} ref={appRef}>
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
      <header className="site-header">
        <a className="brand-link" href="#top" aria-label="진료한장 홈">
          <Brand compact />
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#how-it-works">이용 방법</a>
          <a href="#privacy">개인정보 안내</a>
          <a className="nav-cta" href="#create-report">
            만들어보기
          </a>
        </nav>
      </header>

      <main>
        <HeroSection language={language} changeLanguage={changeLanguage} />

        <EmpathySection language={language} />

        <MethodsSection />

        <FeaturesSection />

        <HowItWorksSection language={language} />

        <PrivacySection />

        <CreateReportSection />

        <BetaFitSection />

        <BetaProcessSection />

        <CTASection />

        <FAQSection />
      </main>

      <footer className="site-footer landing">
        <Brand compact />
        <p>부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장</p>
        <span>진단·처방이 아닌 진료 전 정보 정리 서비스</span>
      </footer>
    </div>
  );
}

export default App;
