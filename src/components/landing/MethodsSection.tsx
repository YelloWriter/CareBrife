import { PhoneCall, Image as ImageIcon, ListChecks, UsersRound, RefreshCcw } from "lucide-react";

export default function MethodsSection() {
  return (
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
  );
}
