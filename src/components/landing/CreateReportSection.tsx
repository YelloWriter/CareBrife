import BriefFlow from "../BriefFlow";

export default function CreateReportSection() {
  return (
        <section className="inline-brief-section" id="create-report" aria-labelledby="create-report-title" data-i18n-skip>
          <div className="inline-brief-heading">
            <p className="section-kicker">YOUR CARING PAGE</p>
            <h2 id="create-report-title">이제, 우리 가족의 진료를 준비해요.</h2>
            <p>편하게 남긴 이야기가 진료실에서 전할 한 장이 됩니다.</p>
          </div>
          <p style={{ textAlign: "center", margin: "0 auto 24px", padding: "0 20px" }}><a href="/templates/" style={{ textDecoration: "underline", fontWeight: 700 }}>무엇부터 준비할지 막막하다면? 준비 템플릿 둘러보기 →</a></p>
          <BriefFlow embedded />
        </section>
  );
}
