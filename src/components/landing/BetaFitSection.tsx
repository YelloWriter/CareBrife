import { Check } from "lucide-react";

export default function BetaFitSection() {
  return (
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
  );
}
