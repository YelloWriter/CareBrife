import { LockKeyhole, ChevronRight } from "lucide-react";

export default function PrivacySection() {
  return (
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
                  음성 입력은 브라우저 제공업체에서 처리될 수 있어요. 연결되지
                  않으면 기기 내 녹음으로 전환하며, 이때 음성을 외부로 보내거나
                  파일로 보관하지 않아요. 처음에는 음성 인식 모델을 내려받아요.
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
            <a href="#create-report">
              안내 확인하고 체험판 시작하기
              <ChevronRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
  );
}
