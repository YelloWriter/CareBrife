"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { arrangeSentences, emptyBrief, organizeStory } from "../lib/brief";
import type { Brief } from "../lib/brief";
import "./brief-flow.css";
import MicrophoneHelp from "./MicrophoneHelp";
import { Button as UIButton } from "./ui/button";

type Screen = "start" | "voice" | "recording" | "text" | "processing" | "review" | "manual" | "complete" | "read" | "speech-error" | "organize-error" | "pdf-error";
const nodeIds: Record<Screen, string> = { start: "842:1821", voice: "842:1846", recording: "842:1868", text: "842:1895", processing: "844:1839", review: "842:1914", manual: "844:1852", complete: "842:1939", read: "843:1931", "speech-error": "842:1966", "organize-error": "842:1978", "pdf-error": "842:1990" };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  start(): void; stop(): void; abort(): void;
  onstart: (() => void) | null; onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult: ((e: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
};
const fields: { key: keyof Brief; label: string; placeholder: string }[] = [
  { key: "main", label: "가장 전하고 싶은 내용", placeholder: "이번 진료에서 가장 전하고 싶은 내용을 적어주세요." },
  { key: "changes", label: "그동안의 변화", placeholder: "언제부터, 어떻게 달라졌는지 적어주세요." },
  { key: "questions", label: "의료진께 물어볼 질문 · 선택", placeholder: "의료진께 궁금한 점이 있나요?" },
];
function Button({ children, onClick, secondary = false, disabled = false }: { children: ReactNode; onClick: () => void; secondary?: boolean; disabled?: boolean }) {
  return <UIButton type="button" size="flow" variant={secondary ? "outline" : "default"} className={`bf-button${secondary ? " bf-secondary" : ""}`} onClick={onClick} disabled={disabled}>{children}</UIButton>;
}
function Prompt() { return <div className="bf-prompt"><strong>이번 진료에서</strong><p>설명하고 싶은 상태와 그동안의 변화를<br />편하게 알려주세요.</p></div>; }
function Logo() { return <img className="bf-logo" src="/figma/logo.png" width="140" height="41" alt="진료한장 - 진료보다 먼저 도착하는 마음" />; }
function Report({ brief, large = false }: { brief: Brief; large?: boolean }) {
  return <article className={`bf-report${large ? " bf-report-large" : ""}`} aria-label="진료한장 리포트">
    {!large && <header><Logo /><span>오늘 작성</span></header>}
    {fields.map(({ key }, i) => <section key={key}><h2>{["오늘 가장 이야기하고 싶은 내용", "그동안의 변화", "진료 중 물어볼 질문"][i]}</h2><p>{brief[key] || "입력한 내용이 없어요."}</p></section>)}
    {!large && <footer>진료 전 정보 정리용 · 진단이나 처방이 아닙니다.</footer>}
  </article>;
}

export default function BriefFlow({ embedded = false }: { embedded?: boolean }) {
  const flowRoot = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<Screen>("start");
  const [story, setStory] = useState("");
  const [brief, setBrief] = useState<Brief>({ ...emptyBrief });
  const [seconds, setSeconds] = useState(0);
  const [writtenDate, setWrittenDate] = useState("");
  const [progress, setProgress] = useState(5);
  const [status, setStatus] = useState("");
  const [detail, setDetail] = useState("");
  const [exitOpen, setExitOpen] = useState(false);
  const [permissionHelpOpen, setPermissionHelpOpen] = useState(false);
  const [pendingVoice, setPendingVoice] = useState(false);
  const screenRef = useRef<Screen>("start");
  const recognition = useRef<Recognition | null>(null);
  const recorded = useRef("");
  const recognitionFailed = useRef(false);
  const operation = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const permissionHelpTrigger = useRef<HTMLButtonElement>(null);
  const dirty = Boolean(story.trim() || Object.values(brief).some(v => v.trim()));
  const canComplete = Boolean(brief.main.trim() || brief.changes.trim());
  const completed = ["complete", "read", "pdf-error"].includes(screen);

  function scrollToFlow() {
    if (embedded) flowRoot.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }
  function navigate(next: Screen, replace = false) {
    setPermissionHelpOpen(false);
    screenRef.current = next;
    setScreen(next);
    const historyState = { ...window.history.state, briefScreen: next };
    window.history[replace ? "replaceState" : "pushState"](historyState, "", embedded ? "#create-report" : `#${next}`);
    if (next !== "recording") scrollToFlow();
  }
  function stopRecognition() {
    const current = recognition.current;
    recognition.current = null;
    if (current) { current.onend = null; current.onresult = null; current.onerror = null; current.onstart = null; current.abort(); }
    setPendingVoice(false);
  }
  useEffect(() => {
    setWrittenDate(new Date().toLocaleDateString("ko-KR"));
    if (!embedded) window.history.replaceState({ ...window.history.state, briefScreen: "start" }, "", window.location.pathname);
    const onPop = (event: PopStateEvent) => {
      if (embedded && !event.state?.briefScreen) return;
      setPermissionHelpOpen(false);
      stopRecognition(); operation.current?.abort();
      const next = event.state?.briefScreen;
      const valid: Screen = next && next in nodeIds && !["processing", "recording"].includes(next) ? next : "start";
      screenRef.current = valid; setScreen(valid);
    };
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("popstate", onPop); stopRecognition(); operation.current?.abort(); };
  }, []);
  useEffect(() => { if (screen !== "recording" && (!embedded || screen !== "start")) heading.current?.focus({ preventScroll: true }); }, [screen, embedded]);
  useEffect(() => {
    if (!dirty && screen !== "recording") return;
    const protect = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty, screen]);
  useEffect(() => {
    if (screen !== "recording") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setSeconds(Math.min(elapsed, 300));
      if (elapsed >= 300) recognition.current?.stop();
    }, 250);
    return () => window.clearInterval(timer);
  }, [screen]);
  useEffect(() => {
    if (exitOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [exitOpen]);

  async function organize(text = story) {
    if (!text.trim()) return;
    operation.current?.abort();
    const controller = new AbortController(); operation.current = controller;
    setProgress(5); setStatus("입력하신 문장을 확인하고 있어요."); navigate("processing");
    const timeout = window.setTimeout(() => {
      if (controller.signal.aborted) return;
      controller.abort(); setDetail("정리가 오래 걸려 중단했어요. 다시 시도하거나 직접 작성할 수 있어요."); navigate("organize-error", true);
    }, 90_000);
    try {
      const result = await organizeStory(text, (n, message) => { if (!controller.signal.aborted) { setProgress(n); setStatus(message); } }, controller.signal);
      if (controller.signal.aborted) return;
      setBrief(result.brief); setStatus(result.method); setProgress(100); navigate("review", true);
    } catch {
      if (!controller.signal.aborted) { setDetail(""); navigate("organize-error", true); }
    } finally { window.clearTimeout(timeout); }
  }
  function startRecording() {
    if (pendingVoice || recognition.current) return;
    const speechWindow = window as typeof window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Constructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Constructor) { setDetail("이 브라우저는 음성 입력을 지원하지 않아요. 글로 입력해 주세요."); navigate("speech-error"); return; }
    recorded.current = ""; recognitionFailed.current = false;
    const instance = new Constructor(); recognition.current = instance;
    instance.lang = "ko-KR"; instance.continuous = true; instance.interimResults = true;
    instance.onstart = () => { setPendingVoice(false); setSeconds(0); navigate("recording"); };
    instance.onresult = event => {
      recorded.current = Array.from(event.results).filter(r => r.isFinal).map(r => r[0].transcript).join(" ");
    };
    instance.onerror = event => {
      recognitionFailed.current = true;
      if (recorded.current.trim()) setStory(prev => [prev, recorded.current.trim()].filter(Boolean).join("\n"));
      setPendingVoice(false);
      setDetail(event.error === "not-allowed" ? "마이크 권한이 허용되지 않았어요. 브라우저 설정에서 권한을 확인하거나 글로 입력해 주세요." : "음성 입력이 중단됐어요. 다시 시도하거나 글로 입력해 주세요.");
      stopRecognition(); navigate("speech-error", true);
    };
    instance.onend = () => {
      recognition.current = null; setPendingVoice(false);
      if (recognitionFailed.current) return;
      const text = recorded.current.trim();
      if (!text) { setDetail("인식된 말이 없어요. 다시 말씀하거나 글로 입력해 주세요."); navigate("speech-error", true); return; }
      const combined = [story, text].filter(Boolean).join("\n"); setStory(combined); void organize(combined);
    };
    setPendingVoice(true);
    try { instance.start(); } catch { stopRecognition(); setDetail("마이크를 시작하지 못했어요. 글로 입력해 주세요."); navigate("speech-error"); }
  }
  function manual() { operation.current?.abort(); setBrief(arrangeSentences(story)); navigate("manual"); }
  function savePdf() {
    setExitOpen(false);
    try {
      if (typeof window.print !== "function") throw new Error("Printing unavailable");
      window.print();
      // A browser cannot tell whether the user saved or cancelled the print dialog.
    } catch { navigate("pdf-error"); }
  }
  function requestExit() {
    if (!embedded) window.scrollTo({ top: 0, behavior: "instant" });
    if (dirty || screen === "recording") setExitOpen(true);
    else { stopRecognition(); returnToLanding(); }
  }
  function returnToLanding() {
    if (embedded) {
      window.history.replaceState({ ...window.history.state, briefScreen: "start" }, "", "#top");
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    } else window.location.assign("/");
  }
  function discard() {
    operation.current?.abort(); stopRecognition(); setExitOpen(false); setStory(""); setBrief({ ...emptyBrief });
    navigate("start", true);
    // Allow the beforeunload effect to remove its listener before leaving.
    window.setTimeout(returnToLanding, 0);
  }
  function title(text: string, className = "") { const Tag = embedded ? "h2" : "h1"; return <Tag ref={heading} tabIndex={-1} className={`bf-title ${className}`}>{text}</Tag>; }
  function tabs() { return <div className="bf-tabs" role="group" aria-label="입력 방식"><button aria-pressed={screen === "voice"} onClick={() => navigate("voice")}>{screen === "voice" && "●  "}말로 입력</button><button aria-pressed={screen === "text"} onClick={() => navigate("text")}>{screen === "text" && "●  "}글로 입력</button></div>; }
  const step = screen === "read" ? "읽기 화면" : ["voice", "recording", "text"].includes(screen) ? "1 / 3  입력" : screen === "processing" ? "2 / 3  정리" : ["review", "manual"].includes(screen) ? "2 / 3  확인" : screen === "complete" ? "3 / 3  완료" : "";
  const errorConfig = {
    "speech-error": ["말을 글로 바꾸지 못했어요", "다시 말하거나 글로 입력해 주세요.", "다시 녹음하기", "글로 입력하기"],
    "organize-error": ["내용을 정리하지 못했어요", "받아쓴 글은 현재 화면에 남아 있어요.", "정리 다시 시도", "직접 작성하기"],
    "pdf-error": ["PDF를 저장하지 못했어요", "완료한 내용은 현재 화면에서 계속 볼 수 있어요.", "PDF 다시 저장", "크게 보기"],
  };
  const error = screen in errorConfig ? errorConfig[screen as keyof typeof errorConfig] : null;

  return <div ref={flowRoot} className={`bf-app${embedded ? " bf-embedded" : ""}`} data-screen={screen} data-node-id={nodeIds[screen]}>
    <header className="bf-header"><div><button className="bf-home" onClick={requestExit} aria-label="진료한장 홈으로 나가기"><Logo /></button><span>{step}</span></div></header>
    <div className={`bf-main bf-${screen}`} role="region" aria-label="진료한장 작성">
      {screen === "start" && <>
        <span className="bf-badge">진료 준비</span>
        {title("처음 가는 병원,\n할 말을 한 장으로.")}
        <p className="bf-intro">말하거나 글로 남기면 중요한 내용과 변화를 정리할 수 있어요.</p>
        <ol className="bf-steps">{["편하게 말하거나 쓰기", "정리된 내용 확인·수정", "진료실에서 보고 설명하기"].map((s, i) => <li key={s}><span>0{i + 1}</span><p>{s}</p></li>)}</ol>
        <div className="bf-notice bf-session">작성 내용은 현재 이용 중에만 남아요.<br />새로고침하거나 나가면 사라집니다.</div>
        <Button onClick={() => navigate("voice")}>진료한장 만들기</Button>
        <p className="bf-footnote">진단·처방이 아닌 진료 전 정리 도구예요.</p>
      </>}
      {(screen === "voice" || screen === "recording" || screen === "text") && <>
        {title(screen === "recording" ? "편하게 말씀해 주세요" : screen === "voice" ? "무엇을 전하고 싶나요?" : "글로 편하게 적어주세요")}
        <Prompt />{screen === "recording" ? <div className="bf-tabs bf-recording-tabs"><span>● 녹음 중</span><span>다시 누르면 종료</span></div> : tabs()}
        {screen !== "text" ? <>
          <div className="bf-voice-action">
            <button className={`bf-mic${screen === "recording" ? " is-recording" : ""}`} aria-label={screen === "recording" ? "녹음 마치기" : "녹음 시작"} aria-pressed={screen === "recording"} onClick={() => screen === "recording" ? recognition.current?.stop() : startRecording()} disabled={pendingVoice}>
              {screen === "recording" ? <span className="bf-stop-symbol" aria-hidden="true" /> : <img src="/figma/microphone.svg" alt="" width="58" height="58" />}
            </button>
            <strong>{pendingVoice ? "마이크 권한을 확인해 주세요" : screen === "recording" ? "한 번 더 눌러 녹음 마치기" : "한 번 눌러 말하기"}</strong>
            {screen === "recording" ? <output className="bf-voice-timer" aria-label="녹음 시간">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</output> : <p>최대 5분 · 다시 누르면 종료</p>}
          </div>
          {screen === "recording" ? <p className="bf-recording-limit">5분이 되면 자동으로 종료돼요.</p> : <Button secondary onClick={() => { stopRecognition(); navigate("text"); }}>글로 입력하기</Button>}

          <p className="bf-footnote">진료한장은 녹음 파일을 저장하지 않아요.</p>
          <details className="bf-voice-privacy"><summary>음성 입력 안내</summary><p>음성은 브라우저 제공업체에서 처리될 수 있어요. 음성 입력을 시작하면 마이크 권한을 요청해요. 원하지 않으면 글로 입력해 주세요.</p></details>
        </> : <>
          <div className="bf-textarea"><textarea aria-label="전하고 싶은 이야기" value={story} maxLength={5000} onChange={e => setStory(e.target.value)} placeholder="예: 지난주부터 계단을 내려갈 때 왼쪽 무릎이 불편해요. 어제는 걷다가도 뻐근했어요." /><span>{story.length}자</span></div>
          <Button disabled={!story.trim()} onClick={() => void organize()}>내용 정리하기</Button>
          <p className="bf-footnote">정리 후 직접 고칠 수 있어요.</p><button className="bf-text-link" onClick={manual}>자동 정리 없이 직접 작성하기</button>
        </>}
      </>}
      {screen === "processing" && <>
        {title("내용을 정리하고 있어요")}<p className="bf-processing-intro">입력하신 말에서 중요한 내용과 변화를 나누고 있어요.</p>
        <div className="bf-processing-icon" aria-hidden="true">✦</div><progress max="100" value={progress} aria-label="정리 진행률" /><p className="bf-processing-wait" role="status">{status || "이 화면을 잠시 기다려 주세요."}</p>
        <div className="bf-processing-bottom"><button className="bf-text-link" onClick={manual}>기다리지 않고 직접 작성하기</button><p className="bf-footnote">처리 중 나가면 현재 내용이 사라질 수 있어요.</p></div>
      </>}
      {(screen === "review" || screen === "manual") && <>
        {title(screen === "review" ? "정리된 내용을 확인해 주세요" : "직접 한 장에 정리해요")}<p className="bf-subtitle">{screen === "review" ? "맞지 않는 문장은 직접 고칠 수 있어요." : "자동 정리를 사용하지 않아도 완성할 수 있어요."}</p>
        <div className="bf-fields">{fields.map(({ key, label, placeholder }) => <div className={`bf-field bf-field-${key}`} key={key}><div><label htmlFor={`brief-${key}`}>{label}</label>{screen === "review" && key !== "questions" && <button aria-label={`${label} 수정`} onClick={() => document.getElementById(`brief-${key}`)?.focus()}>수정 ✎</button>}</div><textarea id={`brief-${key}`} value={brief[key]} placeholder={placeholder} onChange={e => setBrief(b => ({ ...b, [key]: e.target.value }))} /></div>)}</div>
        {screen === "review" && <><details className="bf-transcript"><summary>받아쓴 글 보기 <span>⌄</span></summary><p>{story}</p></details><div className="bf-notice bf-verify">날짜와 현재 상태가 맞는지 확인해 주세요.</div></>}
        <Button disabled={!canComplete} onClick={() => navigate("complete")}>확인하고 완료</Button>
        {screen === "review" && <p className="bf-footnote">{status}</p>}
        {screen === "manual" && story && <details className="bf-transcript bf-manual-original"><summary>입력한 원문 보기 <span>⌄</span></summary><p>{story}</p></details>}
      </>}
      {screen === "complete" && <>
        {title("진료한장이 완성됐어요")}<p className="bf-subtitle">진료실에서 보여주거나 보면서 설명해 보세요.</p><Report brief={brief} />
        <Button onClick={() => navigate("read")}>의료진에게 크게 보여주기</Button><Button secondary onClick={savePdf}>PDF 저장하기</Button>
        <p className="bf-footnote bf-pdf-note">내용이 길면 PDF가 여러 페이지로 저장될 수 있어요.</p><div className="bf-notice bf-session">나가기 전에 PDF를 저장해 주세요.<br />다시 접속해도 이 내용은 복구되지 않습니다.</div>
        <p className="bf-footnote">인쇄 창에서 ‘PDF로 저장’을 선택해 주세요.</p><div className="bf-bottom-links"><button className="bf-text-link" onClick={() => navigate("review")}>내용 수정하기</button><button className="bf-text-link" onClick={requestExit}>나가기</button></div>
      </>}
      {screen === "read" && <>{title("진료한장")}<p className="bf-subtitle">오늘 작성</p><Report brief={brief} large /><Button secondary onClick={savePdf}>PDF 저장하기</Button><button className="bf-text-link" onClick={() => navigate("complete")}>완료 화면으로 돌아가기</button></>}
      {error && <><div className="bf-error-icon" aria-hidden="true">!</div>{title(error[0])}<p className="bf-error-description">{error[1]}</p>{detail && screen !== "pdf-error" && <p className="bf-error-detail" role="status">{detail}</p>}{screen === "speech-error" && <div className="bf-error-help"><button ref={permissionHelpTrigger} type="button" className="bf-text-link" onClick={() => setPermissionHelpOpen(true)} aria-haspopup="dialog">권한 설정 확인하기</button></div>}<div className="bf-error-actions"><Button onClick={() => screen === "speech-error" ? startRecording() : screen === "organize-error" ? void organize() : savePdf()} disabled={pendingVoice}>{pendingVoice ? "마이크 권한 확인 중" : error[2]}</Button><Button secondary onClick={() => screen === "speech-error" ? navigate("text") : screen === "organize-error" ? manual() : navigate("read")}>{error[3]}</Button></div></>}
    </div>
    {permissionHelpOpen && screen === "speech-error" && <MicrophoneHelp onClose={() => { setPermissionHelpOpen(false); window.requestAnimationFrame(() => permissionHelpTrigger.current?.focus({ preventScroll: true })); }} onRetry={() => { setPermissionHelpOpen(false); startRecording(); }} />}
    <dialog ref={dialog} className="bf-dialog" onCancel={() => setExitOpen(false)} aria-labelledby="exit-title" aria-describedby="exit-description" data-node-id="844:1870">
      <h2 id="exit-title">{completed ? "PDF를 저장하지 않고 나갈까요?" : "작성하던 내용을 지우고 나갈까요?"}</h2><p id="exit-description">나가면 작성한 내용은 사라지고 다시 복구할 수 없어요.</p>
      <Button onClick={completed ? savePdf : () => setExitOpen(false)}>{completed ? "PDF 저장하기" : "계속 작성하기"}</Button><Button secondary onClick={discard}>저장하지 않고 나가기</Button>
    </dialog>
    <div className="bf-print"><Report brief={brief} /><p>작성일: {writtenDate}</p></div>
  </div>;
}
