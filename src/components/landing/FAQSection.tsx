
export default function FAQSection() {
  return (
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
  );
}
