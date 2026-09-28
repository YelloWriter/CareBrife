import { Check, ArrowRight } from "lucide-react";
import { BetaLink } from "./shared";

export default function CTASection() {
  return (
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
  );
}
