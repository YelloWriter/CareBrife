"use client";

import { useEffect, useRef, useState } from "react";

const guides = {
  desktop: {
    label: "컴퓨터 · Chrome / Edge",
    steps: ["주소창 왼쪽의 사이트 정보 또는 설정 아이콘을 눌러주세요.", "사이트 권한에서 ‘마이크’를 찾아 ‘허용’으로 바꿔주세요. 보이지 않으면 ‘사이트 설정’을 열어주세요.", "이 화면으로 돌아와 ‘설정 후 다시 녹음하기’를 눌러주세요."],
    extra: "계속 차단된다면 컴퓨터의 개인정보 보호 설정에서도 사용 중인 브라우저의 마이크 접근을 허용해 주세요.",
  },
  android: {
    label: "안드로이드 · Chrome",
    steps: ["Chrome의 더보기(⋮) → 설정 → 사이트 설정 → 마이크로 이동해 주세요.", "마이크 사용을 켜고, ‘차단됨’에 이 사이트가 있으면 선택해 ‘허용’으로 바꿔주세요.", "이 화면으로 돌아와 ‘설정 후 다시 녹음하기’를 눌러주세요."],
    extra: "휴대폰 설정의 앱 → Chrome → 권한에서도 마이크가 허용되어 있는지 확인해 주세요. 기기에 따라 메뉴 이름이 다를 수 있어요.",
  },
  ios: {
    label: "아이폰 / 아이패드 · Safari",
    steps: ["Safari에서 이 사이트를 연 뒤 주소창의 페이지 메뉴를 눌러주세요.", "‘웹사이트 설정’ → ‘마이크’에서 ‘허용’을 선택해 주세요.", "이 화면으로 돌아와 ‘설정 후 다시 녹음하기’를 눌러주세요."],
    extra: "해당 메뉴가 보이지 않으면 기기의 설정 → 앱 → Safari → 마이크를 확인해 주세요. 이전 버전에서는 설정 → Safari에 있어요.",
  },
  safari: {
    label: "Mac · Safari",
    steps: ["화면 위쪽 메뉴에서 Safari → 설정 → 웹사이트를 열어주세요.", "‘마이크’를 선택하고 이 사이트의 권한을 ‘허용’으로 바꿔주세요.", "이 화면으로 돌아와 ‘설정 후 다시 녹음하기’를 눌러주세요."],
    extra: "Mac의 시스템 설정 → 개인정보 보호 및 보안 → 마이크에 브라우저나 사용 중인 앱이 표시되면 접근을 허용해 주세요.",
  },
};
type Guide = keyof typeof guides;

export default function MicrophoneHelp({ onClose, onRetry }: { onClose: () => void; onRetry: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Guide>("desktop");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) setSelected("ios");
    else if (/Android/.test(ua)) setSelected("android");
    else if (/Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)) setSelected("safari");
    const modal = dialog.current;
    modal?.showModal();
    return () => modal?.close();
  }, []);
  const guide = guides[selected];
  return <dialog ref={dialog} className="bf-dialog bf-permission-dialog" aria-labelledby="microphone-help-title" aria-describedby="microphone-help-description" onCancel={onClose}>
    <div className="bf-permission-header">
      <h2 id="microphone-help-title">마이크 권한을 확인해 주세요</h2>
      <button className="bf-permission-close" aria-label="권한 안내 닫기" onClick={onClose}>×</button>
    </div>
    <p id="microphone-help-description">마이크가 차단되어 있다면 아래 순서로 허용해 주세요. 설정은 브라우저나 기기에서 직접 변경할 수 있어요.</p>
    <label className="bf-permission-label" htmlFor="microphone-browser">사용 중인 기기와 브라우저</label>
    <select id="microphone-browser" value={selected} onChange={e => setSelected(e.target.value as Guide)}>
      {Object.entries(guides).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
    </select>
    <ol className="bf-permission-steps" aria-label="마이크 권한 설정 순서">
      {guide.steps.map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span><p>{step}</p></li>)}
    </ol>
    <details className="bf-permission-extra"><summary>허용했는데도 작동하지 않나요?</summary><p>{guide.extra}</p><p>앱 안의 브라우저에서는 음성 입력이나 권한 요청을 지원하지 않을 수 있어요. 그럴 때는 같은 주소를 Chrome 또는 Safari 앱에서 열어주세요. 네트워크 연결도 확인해 주세요.</p></details>
    <div className="bf-permission-notice">새로고침하거나 다른 브라우저로 이동하면 작성 내용이 사라져요. 필요한 글은 먼저 복사해 주세요.</div>
    <button className="bf-button" onClick={onRetry}>설정 후 다시 녹음하기</button>
    <button className="bf-button bf-secondary" onClick={onClose}>안내 닫기</button>
  </dialog>;
}
