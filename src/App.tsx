"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronRight, FileCheck2, Heart, Image as ImageIcon, ListChecks, LockKeyhole, Mic, PhoneCall, Printer, RefreshCcw, ShieldCheck, UsersRound } from "lucide-react";
import {
  isInterfaceTextVariant,
  languageOptions,
  normalizeInterfaceText,
  pageMetadata,
  translateInterfaceText,
} from "./i18n";
import type { Language } from "./i18n";

const BETA_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdv7-MYk37xpZkBIXTOJsZLTyOBeV0_8FSu5pX_eRMaf_SwUA/viewform?usp=header";
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
const empathyQuotes = [
  "언제부터 아프셨는지 병원에서 잘 설명하실 수 있을까?",
  "지금 드시는 약을 정확히 알고 계실까?",
  "물어보려고 했던 걸 깜빡하지 않으실까?",
  "내가 같이 못 가는데, 중요한 이야기가 잘 전달될까?",
  "전에 보내주신 약봉투 사진이 카톡 어디에 있었더라?",
  "진료가 다 끝난 뒤에야 물어볼 게 생각난 적이 있다.",
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img
        className="brand-logo"
        src="/jinryo-hanjang-logo-cropped.png"
        alt="진료한장 - 진료보다 먼저 도착하는 마음"
      />
    </div>
  );
}

function BetaLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={BETA_FORM_URL}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

function App({ initialLanguage = "ko" }: { initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const appRef = useRef<HTMLDivElement>(null);
  const originalTextNodesRef = useRef(new WeakMap<Text, string>());
  const originalAttributesRef = useRef(new WeakMap<Element, Record<string, string>>());
  useEffect(() => {
    if (window.location.hash === "#create-report") window.location.replace("/create/");
  }, []);
  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);

    const nextUrl = new URL(window.location.href);
    if (nextUrl.protocol === "file:") {
      nextUrl.searchParams.set("lang", nextLanguage);
    } else {
      nextUrl.pathname = nextLanguage === "ko" ? "/" : `/${nextLanguage}`;
      nextUrl.searchParams.delete("lang");
    }
    window.history.pushState({ language: nextLanguage }, "", nextUrl);
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
    document.title = pageMetadata[language].title;
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute("content", pageMetadata[language].description);

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
          ".care-flow",
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
          <a className="nav-cta" href="/create/">
            만들어보기
          </a>
        </nav>
      </header>

      <main>
        <section className="hero-composed landing" id="top">
          <div className="leaf-shadow leaf-shadow-top" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="leaf-shadow leaf-shadow-bottom" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-composed-inner">
            <div className="hero-composed-copy">
              <nav
                className="language-switcher"
                aria-label="언어 선택"
                data-i18n-skip
              >
                {languageOptions.map((option, index) => (
                  <div className="language-option" key={option.code}>
                    <button
                      type="button"
                      className={language === option.code ? "is-active" : ""}
                      onClick={() => changeLanguage(option.code)}
                      aria-pressed={language === option.code}
                      lang={option.htmlLang}
                    >
                      {option.label}
                    </button>
                    {index < languageOptions.length - 1 && (
                      <span aria-hidden="true">/</span>
                    )}
                  </div>
                ))}
              </nav>
              <h1 data-i18n-skip>
                {language === "ko" && (
                  <>
                    <span>부모님 진료,</span>
                    <span>
                      <em>함께</em> 못 가도
                    </span>
                    <span>
                      준비는 <em>함께</em>할 수 있어요.
                    </span>
                  </>
                )}
                {language === "en" && (
                  <>
                    <span>Even when you cannot</span>
                    <span>
                      <em>be there</em> in person,
                    </span>
                    <span>
                      you can <em>prepare together.</em>
                    </span>
                  </>
                )}
              </h1>
              <p className="hero-composed-tagline">
                부모님의 진료를 준비하는 가장 다정한 한 장
              </p>
              <p className="hero-composed-description">
                부모님의 증상, 복용약, 최근 변화와 궁금한 점을 병원에서
                보여줄 한 장으로 정리해드려요.
              </p>
              <div className="hero-actions hero-composed-actions">
                <a className="button button-primary" href="/create/">
                  진료한장 만들어보기
                  <ArrowDown size={18} aria-hidden="true" />
                </a>
                <BetaLink className="button button-secondary">
                  베타테스터 신청하기
                  <ArrowRight size={18} aria-hidden="true" />
                </BetaLink>
              </div>
              <div className="hero-notice hero-composed-notice">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>
                  진단이나 처방 대신, 진료 전에 필요한 정보를 함께 정리해요.
                </span>
              </div>
            </div>

            <div className="hero-paper-stage" aria-hidden="true">
              <div className="hero-paper-card">
                <img
                  src="/jinryo-hanjang-symbol-cropped.png"
                  alt=""
                  width="120"
                  height="92"
                />
                <div className="hero-paper-rule hero-paper-rule-strong" />
                <div className="hero-paper-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-paper-signature">
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="empathy-section landing" aria-labelledby="empathy-title">
          <div className="section-heading">
            <p className="section-kicker">A FAMILIAR WORRY</p>
            <h2 id="empathy-title">
              부모님 병원 가시는 날,
              <br />
              이런 생각이 든 적 있나요?
            </h2>
          </div>
          <div className="empathy-grid">
            {empathyQuotes.map((quote) => (
              <blockquote key={quote} data-i18n-skip>
                “{translateInterfaceText(quote, language)}”
              </blockquote>
            ))}
          </div>
          <div className="empathy-summary">
            <strong>
              부모님을 챙기고 싶은 마음은 크지만,
              <br />
              필요한 정보가 전화와 카카오톡, 사진과 메모에 나뉘어 있는
              경우가 참 많아요.
            </strong>
            <p>
              진료한장은 익숙한 방법을 바꾸는 대신, 흩어진 내용을 진료 전에
              한 번에 모을 수 있게 도와드려요.
            </p>
          </div>
        </section>

        <section className="methods-section landing" aria-labelledby="methods-title">
          <div className="section-heading">
            <p className="section-kicker">HOW WE CARE TODAY</p>
            <h2 id="methods-title">
              지금도 나름의 방법으로
              <br />
              잘 챙기고 있어요.
            </h2>
          </div>
          <div className="methods-grid">
            <article>
              <PhoneCall size={25} aria-hidden="true" />
              <p>전화로 어디가 불편하신지 다시 여쭤봐요</p>
            </article>
            <article>
              <ImageIcon size={25} aria-hidden="true" />
              <p>카톡에서 예전에 받은 약봉투 사진을 찾아요</p>
            </article>
            <article>
              <ListChecks size={25} aria-hidden="true" />
              <p>생각나는 질문을 메모장에 따로 적어둬요</p>
            </article>
            <article>
              <UsersRound size={25} aria-hidden="true" />
              <p>함께 가는 가족에게 내용을 다시 설명해요</p>
            </article>
            <article>
              <RefreshCcw size={25} aria-hidden="true" />
              <p>진료 때마다 비슷한 준비를 반복하게 돼요</p>
            </article>
          </div>
          <div className="methods-summary">
            <strong>
              필요한 정보는 이미 우리에게 있어요.
              <br />
              진료 전에 한 번에 보기 쉽게 정리되지 않았을 뿐이랍니다.
            </strong>
            <p>
              진료한장은 이 방법을 바꾸려는 게 아니라, 흩어진 내용을 한 번에
              모을 수 있게 도와드려요.
            </p>
          </div>
        </section>

        <section className="value-section landing" aria-labelledby="value-title">
          <div className="section-heading">
            <p className="section-kicker">ONE CARING PAGE</p>
            <h2 id="value-title">
              진료한장은 부모님의 이야기를
              <br />
              진료에 쓸 수 있는 <span>한 장</span>으로 정리해요.
            </h2>
          </div>
          <div className="value-grid">
            <article>
              <div className="value-icon">
                <Heart size={25} aria-hidden="true" />
              </div>
              <h3>편하게 이야기하기</h3>
              <p>
                부모님이 직접 불편한 점을 말씀하시거나, 자녀가 대신 입력할 수
                있어요. 꼭 정확한 문장으로 말하지 않아도 괜찮아요.
              </p>
            </article>
            <article>
              <div className="value-icon">
                <UsersRound size={25} aria-hidden="true" />
              </div>
              <h3>함께 확인하기</h3>
              <p>
                증상, 복용 중인 약, 최근 달라진 점과 궁금한 내용을 자녀가
                확인하고 필요한 부분을 더할 수 있어요.
              </p>
            </article>
            <article>
              <div className="value-icon">
                <FileCheck2 size={25} aria-hidden="true" />
              </div>
              <h3>한 장으로 챙겨가기</h3>
              <p>
                병원에서 빠르게 볼 수 있도록 중요한 내용만 한 장으로 정리해
                가족에게 보내거나 직접 가져갈 수 있어요.
              </p>
            </article>
          </div>
          <p className="value-note">
            함께 병원에 가지 못하는 날에도, 진료 준비까지 혼자 맡겨두지
            않으셔도 괜찮아요.
          </p>
        </section>

        <section className="steps landing" id="how-it-works">
          <div className="section-heading">
            <p className="section-kicker">HOW IT WORKS</p>
            <h2>진료 준비는 간단할수록 좋아요.</h2>
          </div>
          <div className="step-grid">
            <article>
              <span className="step-number">01</span>
              <div className="step-icon">
                <ListChecks size={24} aria-hidden="true" />
              </div>
              <h3>편하게 말하거나 입력해요</h3>
              <p>부모님이나 자녀가 불편한 점과 궁금한 내용을 남겨주세요.</p>
            </article>
            <article>
              <span className="step-number">02</span>
              <div className="step-icon">
                <CalendarDays size={24} aria-hidden="true" />
              </div>
              <h3>필요한 내용끼리 정리해요</h3>
              <p>증상, 시작 시점, 복용약, 최근 변화와 질문으로 나눠요.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <div className="step-icon">
                <UsersRound size={24} aria-hidden="true" />
              </div>
              <h3>자녀가 한 번 더 확인해요</h3>
              <p>잘못 적힌 내용이나 빠진 부분이 없는지 쉽게 보완해요.</p>
            </article>
            <article>
              <span className="step-number">04</span>
              <div className="step-icon">
                <Printer size={24} aria-hidden="true" />
              </div>
              <h3>병원에 가져가요</h3>
              <p>완성된 진료한장을 가족에게 보내거나 인쇄해 챙겨가요.</p>
            </article>
          </div>
          <div
            className="care-flow"
            role="img"
            aria-label="말하기, 함께 확인하기, 한 장으로 정리하기, 병원에서 보여주기 흐름"
          >
            <div className="care-flow-step">
              <div className="care-character care-character-talk" aria-hidden="true">
                <span className="character-head">
                  <i />
                  <i />
                  <b />
                </span>
                <span className="character-body" />
                <span className="character-prop">
                  <Mic size={18} />
                </span>
              </div>
              <strong>말하기</strong>
            </div>
            <span className="care-flow-arrow" aria-hidden="true">
              <ArrowRight size={22} />
            </span>
            <div className="care-flow-step">
              <div className="care-character care-character-review" aria-hidden="true">
                <span className="character-head">
                  <i />
                  <i />
                  <b />
                </span>
                <span className="character-body" />
                <span className="character-prop">
                  <UsersRound size={19} />
                </span>
              </div>
              <strong>확인하기</strong>
            </div>
            <span className="care-flow-arrow" aria-hidden="true">
              <ArrowRight size={22} />
            </span>
            <div className="care-flow-step">
              <div className="care-character care-character-page" aria-hidden="true">
                <span className="character-head">
                  <i />
                  <i />
                  <b />
                </span>
                <span className="character-body" />
                <span className="character-prop">
                  <FileCheck2 size={19} />
                </span>
              </div>
              <strong>한 장 정리</strong>
            </div>
            <span className="care-flow-arrow" aria-hidden="true">
              <ArrowRight size={22} />
            </span>
            <div className="care-flow-step">
              <div className="care-character care-character-clinic" aria-hidden="true">
                <span className="character-head">
                  <i />
                  <i />
                  <b />
                </span>
                <span className="character-body" />
                <span className="character-prop">
                  <Printer size={19} />
                </span>
              </div>
              <strong>병원에서 보여주기</strong>
            </div>
          </div>
        </section>

        <section className="privacy-section landing" id="privacy">
          <div className="privacy-heading">
            <div className="privacy-icon">
              <LockKeyhole size={26} aria-hidden="true" />
            </div>
            <div>
              <p className="section-kicker">PRIVATE BY DESIGN</p>
              <h2>건강정보를 다루는 방식부터 다정하고 분명하게 알려드려요.</h2>
            </div>
          </div>
          <div className="privacy-card-grid">
            <article>
              <span>지금 이용하는 체험판</span>
              <h3>적어주신 내용은 이 브라우저 안에서만 머물러요.</h3>
              <ul>
                <li>입력한 내용은 서버에 저장하지 않아요.</li>
                <li>새로고침하거나 창을 닫으면 입력 내용이 사라져요.</li>
                <li>
                  이름을 적지 않아도 증상과 복용약은 건강정보일 수 있어요. AI
                  정리는 기기 안에서 진행하고 외부 무료 AI로 보내지 않아요.
                </li>
                <li>
                  음성 입력은 브라우저 기본 기능을 사용해요. 말하기 전에는 사용
                  중인 브라우저의 개인정보 안내도 함께 확인해 주세요.
                </li>
              </ul>
            </article>
            <article>
              <span>앞으로 출시할 정식 서비스</span>
              <h3>일상 데이터를 모으기 전에 안전한 기준부터 준비할게요.</h3>
              <ul>
                <li>어떤 정보를 왜 모으는지 먼저 이해하기 쉽게 알려드려요.</li>
                <li>보관 기간과 삭제 방법, 가족과 공유하는 범위를 정해둘게요.</li>
                <li>정보를 볼 수 있는 사람과 접근 권한을 꼼꼼하게 나눌게요.</li>
                <li>
                  법률 검토를 마친 개인정보 처리방침을 출시 전에 공개할게요.
                </li>
              </ul>
            </article>
          </div>
          <div className="privacy-bottom">
            <p>
              정식 서비스의 저장·공유 방식은 지금 체험판과 달라질 수 있어요.
              민감한 건강정보를 입력하기 전에는 그때 공개되는 개인정보
              처리방식을 꼭 확인해 주세요.
            </p>
            <a href="/create/">
              안내 확인하고 체험판 시작하기
              <ChevronRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="beta-fit-section landing"
          aria-labelledby="beta-fit-title"
        >
          <div className="section-heading">
            <p className="section-kicker">WHO WE ARE LOOKING FOR</p>
            <h2 id="beta-fit-title">이런 경험이 있다면 함께해주세요.</h2>
          </div>
          <ul className="beta-fit-list">
            <li>
              <Check size={17} aria-hidden="true" />
              부모님과 따로 살고 있어요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              정기적으로 병원에 다니시는 부모님이 있어요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              부모님의 증상이나 복용약을 가끔 확인해요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              직장이나 거리 문제로 매번 병원에 같이 가지는 못해요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              진료 전에 부모님이 무슨 말을 해야 할지 정리해본 적이 있어요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              약봉투 사진이나 병원 이야기를 카카오톡으로 받아본 적이 있어요.
            </li>
            <li>
              <Check size={17} aria-hidden="true" />
              부모님 진료 준비가 조금 더 간단했으면 좋겠다고 느껴요.
            </li>
          </ul>
          <div className="beta-fit-note">
            <strong>아직 완성된 서비스는 아니에요.</strong>
            <p>
              부모님 진료를 챙겨보신 분들의 실제 경험을 들으며 더 편하고
              따뜻한 방법을 만들어가고 있답니다.
            </p>
          </div>
        </section>

        <section
          className="beta-process-section landing"
          aria-labelledby="beta-process-title"
        >
          <div className="section-heading">
            <p className="section-kicker">BETA PROCESS</p>
            <h2 id="beta-process-title">
              베타테스트는 이렇게 진행될 예정이에요.
            </h2>
          </div>
          <div className="beta-process-grid">
            <article>
              <span>01</span>
              <p>부모님 진료를 평소 어떻게 챙기는지 간단히 알려주세요.</p>
            </article>
            <article>
              <span>02</span>
              <p>진료한장의 초기 화면이나 기능을 가볍게 함께 살펴봐요.</p>
            </article>
            <article>
              <span>03</span>
              <p>편했던 점과 불편했던 점을 솔직하고 편하게 알려주세요.</p>
            </article>
            <article>
              <span>04</span>
              <p>실제로 어떤 기능이 있으면 좋을지 편하게 이야기를 나눠요.</p>
            </article>
          </div>
          <p className="beta-process-note">
            전문적인 의견이나 어려운 설명은 필요하지 않아요. 평소 경험을
            편하게 말씀해주시면 된답니다.
          </p>
        </section>

        <section className="beta-section landing">
          <div>
            <p className="section-kicker">BETA TESTER</p>
            <h2>
              부모님 진료 준비,
              <br />
              한 장부터 함께 만들어볼까요?
            </h2>
          </div>
          <div className="beta-copy">
            <p>
              부모님 병원 진료를 챙겨본 경험이 있다면, 진료한장이 우리
              가족에게 진짜 도움이 될지 소중한 의견을 들려주세요.
            </p>
            <ul>
              <li>
                <Check size={15} aria-hidden="true" />
                신청한다고 유료 서비스에 가입되거나 결제가 진행되지 않아요.
              </li>
              <li>
                <Check size={15} aria-hidden="true" />
                베타테스트 일정과 참여 방법은 신청하신 분께 안내드려요.
              </li>
              <li>
                <Check size={15} aria-hidden="true" />
                안내 내용을 확인한 뒤 참여 여부를 결정해도 괜찮아요.
              </li>
            </ul>
            <BetaLink className="button button-light">
              부모님 진료, 한 장 먼저 챙겨보기
              <ArrowRight size={18} aria-hidden="true" />
            </BetaLink>
            <small>유료 가입이나 결제가 아닌 베타테스터 신청이에요.</small>
          </div>
        </section>

        <section className="faq-section landing" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="section-kicker">FREQUENTLY ASKED</p>
            <h2 id="faq-title">자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>진료한장은 병을 진단해주는 서비스인가요?</summary>
              <p>
                아니요, 진료한장은 진단이나 처방을 해주는 곳은 아니에요.
                부모님이 병원에서 전해야 할 증상과 복용약, 궁금한 내용을 미리
                쉽게 정리하도록 돕는 서비스랍니다.
              </p>
            </details>
            <details>
              <summary>부모님이 직접 사용해야 하나요?</summary>
              <p>
                부모님이 직접 말씀하실 수도 있고, 자녀가 대신 입력하거나 함께
                내용을 확인할 수도 있어요. 편하신 방법을 선택하시면 된답니다.
              </p>
            </details>
            <details>
              <summary>부모님의 건강정보를 입력해도 괜찮을까요?</summary>
              <p>
                현재 체험판에서는 입력한 내용이 서버에 저장되지 않아요.
                리포트와 AI 정리는 사용 중인 브라우저 안에서 처리되며, 화면을
                새로고침하면 입력 내용이 사라져요. 실제 출시 서비스의 저장과
                공유 방식은 개인정보와 건강정보를 안전하게 관리할 수 있도록
                법률 검토와 테스트 결과를 반영해 설계할 예정이에요.
              </p>
            </details>
            <details>
              <summary>서비스는 언제 사용할 수 있나요?</summary>
              <p>
                지금 이 페이지에서 체험판을 사용해볼 수 있어요. 정식 서비스는
                부모님 진료를 챙기시는 자녀분들의 진짜 불편함과 생생한 경험을
                듣고, 베타테스터분들의 의견을 충분히 반영해 꼭 필요한 기능과
                출시 시기를 결정할 예정이에요.
              </p>
            </details>
            <details>
              <summary>
                부모님의 병명이나 자세한 건강정보를 입력해야 하나요?
              </summary>
              <p>
                베타테스터 신청 단계에서는 구체적인 병명이나 진료기록을
                입력하지 않으셔도 돼요. 부모님의 병원 방문 빈도와 평소 진료를
                어떻게 챙기고 계신지 정도만 간단히 여쭤보고 있어요.
              </p>
            </details>
            <details>
              <summary>신청하면 꼭 베타테스트에 참여해야 하나요?</summary>
              <p>
                아니요, 부담 갖지 않으셔도 괜찮아요. 신청해주시면 일정과 참여
                방법을 먼저 안내해 드릴 테니, 내용을 천천히 확인하시고 편하게
                결정해 주세요.
              </p>
            </details>
            <details>
              <summary>서비스 이용료가 있나요?</summary>
              <p>
                지금은 서비스가 정말 필요한지, 어떻게 쓰면 편할지 확인하는
                베타테스트 단계라서 정식 서비스의 요금이나 결제 방식은 아직
                정해지지 않았어요. 현재 체험판과 베타테스터 신청은 무료이며
                결제가 진행되지 않아요.
              </p>
            </details>
            <details>
              <summary>부모님과 함께 살지 않아도 사용할 수 있나요?</summary>
              <p>
                네, 맞아요. 부모님과 따로 살면서 전화나 카카오톡으로 마음
                졸이며 진료를 챙기고 계신 자녀분들을 가장 먼저 생각하며 만들고
                있답니다.
              </p>
            </details>
          </div>
        </section>
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
