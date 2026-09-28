import { ArrowDown, ArrowRight, ShieldCheck } from "lucide-react";
import { languageOptions, type Language } from "@/i18n";
import { BetaLink } from "./shared";
import { Button } from "../ui/button";

export default function HeroSection({ language, changeLanguage }: { language: Language; changeLanguage: (language: Language) => void }) {
  return (
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
                <Button asChild size="landing" className="button button-primary"><a href="#create-report">
                  진료한장 만들어보기
                  <ArrowDown size={18} aria-hidden="true" />
                </a></Button>
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
                  src="/symbol.webp"
                  srcSet="/symbol-small.webp 96w, /symbol.webp 192w"
                  sizes="96px"
                  alt=""
                  width="192"
                  height="166"
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
  );
}
