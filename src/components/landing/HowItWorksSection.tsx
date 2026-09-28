import { ListChecks, CalendarDays, UsersRound, Printer } from "lucide-react";
import type { Language } from "@/i18n";
import CareJourney from "../CareJourney";

export default function HowItWorksSection({ language }: { language: Language }) {
  return (
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
          <CareJourney language={language} />
        </section>
  );
}
