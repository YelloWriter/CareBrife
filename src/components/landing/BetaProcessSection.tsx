
export default function BetaProcessSection() {
  return (
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
  );
}
