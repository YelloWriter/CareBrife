"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../i18n";
import "./care-journey.css";

const stages = [
  { key: "talk", ko: "말하기", en: "Tell your story", caption: "편하게 들려주세요", englishCaption: "In your own words" },
  { key: "review", ko: "확인하기", en: "Review together", caption: "함께 살펴보고 고쳐요", englishCaption: "Check the details together" },
  { key: "organize", ko: "한 장 정리", en: "Make one clear page", caption: "중요한 내용을 한눈에", englishCaption: "The important things, at a glance" },
  { key: "clinic", ko: "병원에서 보여주기", en: "Bring it to your visit", caption: "의료진과 이야기를 나눠요", englishCaption: "Share it with your clinician" },
];
export default function CareJourney({ language = "ko" }: { language?: Language }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="care-journey" data-animate={visible && !paused} data-i18n-skip>
    <ol className="journey-stages" aria-label={language === "ko" ? "진료한장 이용 단계" : "How Carebrief works"}>
      {stages.map((stage, index) => <li key={stage.key} className={`journey-stage journey-${stage.key}`}>
        <div className="journey-scene" aria-hidden="true">
          <span className="journey-halo" />
          <img src={`/illustrations/${stage.key}.webp`} alt="" loading="lazy" width="640" height="640" />
          {stage.key === "talk" && <div className="journey-sound">{[0,1,2,3,4].map(n => <i key={n} />)}</div>}
          {stage.key === "review" && <div className="journey-checks"><i>✓</i><i>✓</i><i>✓</i></div>}
          {stage.key === "organize" && <div className="journey-pages"><i /><i /><i /></div>}
          {stage.key === "clinic" && <div className="journey-present"><span /><i>✓</i></div>}
        </div>
        <span className="journey-number">0{index + 1}</span>
        <strong>{language === "ko" ? stage.ko : stage.en}</strong>
        <p>{language === "ko" ? stage.caption : stage.englishCaption}</p>
      </li>)}
    </ol>
    <button type="button" className="journey-motion-toggle" aria-pressed={paused} onClick={() => setPaused(p => !p)}>{language === "ko" ? (paused ? "움직임 재생" : "움직임 멈추기") : (paused ? "Play animation" : "Pause animation")}</button>
  </div>;
}
