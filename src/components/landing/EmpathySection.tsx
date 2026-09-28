import { translateInterfaceText, type Language } from "@/i18n";
const empathyQuotes = [
  "언제부터 아프셨는지 병원에서 잘 설명하실 수 있을까?",
  "지금 드시는 약을 정확히 알고 계실까?",
  "물어보려고 했던 걸 깜빡하지 않으실까?",
  "내가 같이 못 가는데, 중요한 이야기가 잘 전달될까?",
  "전에 보내주신 약봉투 사진이 카톡 어디에 있었더라?",
  "진료가 다 끝난 뒤에야 물어볼 게 생각난 적이 있다.",
];


export default function EmpathySection({ language }: { language: Language }) {
  return (
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
  );
}
