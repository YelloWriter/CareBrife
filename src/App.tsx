import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CirclePlus,
  FileCheck2,
  Heart,
  ListChecks,
  LockKeyhole,
  Minus,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const BETA_FORM_URL = "{{Google Forms URL}}";

type FormData = {
  writtenDate: string;
  visitGoal: string;
  mainSymptom: string;
  symptomStart: string;
  occurrenceContext: string;
  occurrencePattern: string;
  worseningFactors: string;
  relievingFactors: string;
  beforeAfterContext: string;
  careReceived: string;
  medications: string;
  questions: string;
  materials: string;
};

type TimelineEntry = {
  id: number;
  period: string;
  detail: string;
};

type TimelineRow = {
  period: string;
  details: string[];
};

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

const initialForm: FormData = {
  writtenDate: getToday(),
  visitGoal: "",
  mainSymptom: "",
  symptomStart: "",
  occurrenceContext: "",
  occurrencePattern: "",
  worseningFactors: "",
  relievingFactors: "",
  beforeAfterContext: "",
  careReceived: "",
  medications: "",
  questions: "",
  materials: "",
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${year}.${month}.${day}`;
};

type FieldProps = {
  id: keyof FormData;
  label: string;
  value: string;
  onChange: (id: keyof FormData, value: string) => void;
  hint?: string;
  placeholder?: string;
  rows?: number;
  type?: "text" | "date";
  maxLength?: number;
};

function Field({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows,
  type = "text",
  maxLength = 240,
}: FieldProps) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor={id}>{label}</label>
        {hint && <span className="field-hint">{hint}</span>}
      </div>
      {rows ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          placeholder={placeholder}
          maxLength={type === "date" ? undefined : maxLength}
        />
      )}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img
        className="brand-logo"
        src="/jinryo-hanjang-logo-cropped.png"
        alt="진료한장 - 진료보다 먼저 도착하는 마음"
      />
    </div>
  );
}

function BetaLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (BETA_FORM_URL.startsWith("{{")) {
      event.preventDefault();
      window.alert(
        "Google Forms 주소를 연결할 자리입니다. README의 안내에 따라 링크를 교체해 주세요.",
      );
    }
  };

  return (
    <a
      className={className}
      href={BETA_FORM_URL}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

function App() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([
    { id: 1, period: "", detail: "" },
  ]);
  const nextTimelineId = useRef(2);
  const reportRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fitReportToPage = () => {
      const report = reportRef.current;
      if (!report) return;

      report.style.setProperty("--print-zoom", "1");
      const availableHeight = report.clientHeight;
      const contentHeight = report.scrollHeight;
      const printZoom =
        contentHeight > availableHeight ? availableHeight / contentHeight : 1;
      report.style.setProperty("--print-zoom", printZoom.toFixed(3));
    };

    const resetReportScale = () => {
      reportRef.current?.style.removeProperty("--print-zoom");
    };

    window.addEventListener("beforeprint", fitReportToPage);
    window.addEventListener("afterprint", resetReportScale);
    return () => {
      window.removeEventListener("beforeprint", fitReportToPage);
      window.removeEventListener("afterprint", resetReportScale);
    };
  }, []);

  const updateForm = (id: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [id]: value }));
  };

  const updateTimeline = (
    id: number,
    key: "period" | "detail",
    value: string,
  ) => {
    setTimelineEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, [key]: value } : entry,
      ),
    );
  };

  const addTimelineEntry = () => {
    setTimelineEntries((entries) => [
      ...entries,
      { id: nextTimelineId.current++, period: "", detail: "" },
    ]);
  };

  const removeTimelineEntry = (id: number) => {
    setTimelineEntries((entries) =>
      entries.length === 1
        ? [{ id: entries[0].id, period: "", detail: "" }]
        : entries.filter((entry) => entry.id !== id),
    );
  };

  const timelineRows = useMemo<TimelineRow[]>(() => {
    const grouped = new Map<string, string[]>();
    const addToGroup = (period: string, detail: string) => {
      const cleanPeriod = period.trim();
      const cleanDetail = detail.trim();
      if (!cleanPeriod || !cleanDetail) return;
      const previous = grouped.get(cleanPeriod) ?? [];
      grouped.set(cleanPeriod, [...previous, ...splitLines(cleanDetail)]);
    };

    if (form.symptomStart.trim()) {
      const symptomDetails = [
        form.mainSymptom.trim() && `증상 시작 · ${form.mainSymptom.trim()}`,
        form.occurrenceContext.trim() &&
          `발생 상황 · ${form.occurrenceContext.trim()}`,
        form.occurrencePattern.trim() &&
          `발생 양상 · ${form.occurrencePattern.trim()}`,
        form.worseningFactors.trim() &&
          `악화 요인 · ${form.worseningFactors.trim()}`,
        form.relievingFactors.trim() &&
          `완화 요인 · ${form.relievingFactors.trim()}`,
      ].filter(Boolean) as string[];

      symptomDetails.forEach((detail) =>
        addToGroup(form.symptomStart, detail),
      );
    }

    timelineEntries.forEach((entry) =>
      addToGroup(entry.period, entry.detail),
    );

    return Array.from(grouped, ([period, details]) => ({
      period,
      details: Array.from(new Set(details)),
    }));
  }, [form, timelineEntries]);

  const symptomDetails = [
    form.mainSymptom.trim() && form.mainSymptom.trim(),
    form.occurrenceContext.trim() &&
      `발생 상황: ${form.occurrenceContext.trim()}`,
    form.occurrencePattern.trim() &&
      `발생 양상: ${form.occurrencePattern.trim()}`,
    form.worseningFactors.trim() &&
      `악화 요인: ${form.worseningFactors.trim()}`,
    form.relievingFactors.trim() &&
      `완화 요인: ${form.relievingFactors.trim()}`,
  ].filter(Boolean) as string[];

  const questions = splitLines(form.questions).slice(0, 3);
  const materials = splitLines(form.materials);
  const medications = splitLines(form.medications);

  const hasReportContent =
    timelineRows.length > 0 ||
    form.visitGoal.trim() ||
    symptomDetails.length > 0 ||
    form.beforeAfterContext.trim() ||
    form.careReceived.trim() ||
    medications.length > 0 ||
    questions.length > 0 ||
    materials.length > 0;

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand-link" href="#top" aria-label="진료한장 홈">
          <Brand compact />
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#how-it-works">이용 방법</a>
          <a href="#privacy">개인정보 안내</a>
          <a className="nav-cta" href="#create-report">
            만들어보기
          </a>
        </nav>
      </header>

      <main>
        <section className="hero landing" id="top">
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">
              <Heart size={16} strokeWidth={2.2} aria-hidden="true" />
              떨어져 있어도, 진료 준비는 함께
            </p>
            <h1>
              부모님 진료,
              <br />
              함께 못 가도 준비는
              <br />
              <span>함께할 수 있어요.</span>
            </h1>
            <p className="hero-description">
              부모님의 증상, 복용약, 최근 변화와 궁금한 점을
              <br className="desktop-break" /> 병원에서 보여줄 한 장으로
              정리합니다.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#create-report">
                진료한장 만들어보기
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <BetaLink className="button button-secondary">
                베타테스터 신청하기
                <ArrowRight size={18} aria-hidden="true" />
              </BetaLink>
            </div>
            <p className="brand-copy">
              부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장
            </p>
            <div className="hero-notice">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                진단·처방이 아닌, 진료 전에 정보를 정리하는 서비스입니다.
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-label="진료한장 리포트 예시">
            <div className="preview-orbit orbit-one" aria-hidden="true" />
            <div className="preview-orbit orbit-two" aria-hidden="true" />
            <div className="sample-sheet">
              <div className="sample-header">
                <Brand compact />
                <span>작성일 2026.07.29</span>
              </div>
              <div className="sample-title-row">
                <div>
                  <span className="sample-kicker">오늘의 진료 준비</span>
                  <strong>말하지 못한 정보가 없도록</strong>
                </div>
                <div className="sample-heart">
                  <img
                    src="/jinryo-hanjang-symbol-cropped.png"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="sample-timeline">
                <span>시기</span>
                <span>부모님의 변화</span>
                <strong>최근</strong>
                <p>불편한 증상과 달라진 점</p>
                <strong>현재</strong>
                <p>복용 중인 약과 궁금한 점</p>
              </div>
              <div className="sample-cards">
                <div>
                  <span className="sample-icon">01</span>
                  <p>가장 불편한 증상</p>
                </div>
                <div>
                  <span className="sample-icon">02</span>
                  <p>복용약과 건강보조제</p>
                </div>
              </div>
              <div className="sample-checks">
                <span>
                  <Check size={14} aria-hidden="true" /> 의료진께 확인할 질문
                </span>
                <span>
                  <Check size={14} aria-hidden="true" /> 진료 시 가져갈 자료
                </span>
              </div>
            </div>
            <div className="floating-note floating-note-top">
              <Sparkles size={16} aria-hidden="true" />
              입력하면 바로 미리보기
            </div>
            <div className="floating-note floating-note-bottom">
              <FileCheck2 size={16} aria-hidden="true" />
              A4 한 장으로 저장
            </div>
          </div>
        </section>

        <section className="steps landing" id="how-it-works">
          <div className="section-heading">
            <p className="section-kicker">HOW IT WORKS</p>
            <h2>진료 전에 필요한 말들을 놓치지 않도록</h2>
            <p>기억을 더듬는 대신, 함께 채운 한 장을 건네세요.</p>
          </div>
          <div className="step-grid">
            <article>
              <span className="step-number">01</span>
              <div className="step-icon">
                <ListChecks size={24} aria-hidden="true" />
              </div>
              <h3>부모님의 이야기를 적어요</h3>
              <p>증상과 최근 변화, 복용 중인 약을 대화하듯 정리합니다.</p>
            </article>
            <article>
              <span className="step-number">02</span>
              <div className="step-icon">
                <CalendarDays size={24} aria-hidden="true" />
              </div>
              <h3>시간 순서로 모아요</h3>
              <p>같은 시기의 변화는 한 줄에 모여 진료 흐름을 보여줍니다.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <div className="step-icon">
                <Printer size={24} aria-hidden="true" />
              </div>
              <h3>한 장으로 챙겨요</h3>
              <p>미리 확인하고 인쇄하거나 A4 PDF로 저장할 수 있습니다.</p>
            </article>
          </div>
        </section>

        <section className="privacy-band landing" id="privacy">
          <div className="privacy-icon">
            <LockKeyhole size={26} aria-hidden="true" />
          </div>
          <div>
            <p className="section-kicker">PRIVATE BY DESIGN</p>
            <h2>적어주신 건강정보는 이 기기 안에서만 머물러요.</h2>
            <p>
              입력한 정보는 사용자의 브라우저에서 리포트 미리보기를 만들기
              위한 용도로만 사용되며, 현재 버전에서는 서버에 저장되지
              않습니다.
            </p>
          </div>
          <a href="#create-report">
            개인정보 안내 확인하고 시작하기
            <ChevronRight size={18} aria-hidden="true" />
          </a>
        </section>

        <section className="workspace-section" id="create-report">
          <div className="workspace-heading">
            <p className="section-kicker">MAKE YOUR PAGE</p>
            <h2>부모님의 진료 이야기를 한 장에 담아보세요.</h2>
            <p>
              아는 만큼만 적어도 괜찮아요. 비워둔 항목은 리포트에 나타나지
              않습니다.
            </p>
          </div>

          <div className="workspace-shell">
            <form
              className="editor-pane"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="browser-only-notice" role="note">
                <ShieldCheck size={20} aria-hidden="true" />
                <div>
                  <strong>입력 내용은 서버에 저장되지 않아요.</strong>
                  <p>
                    이 브라우저에서 미리보기를 만드는 동안만 사용됩니다.
                    민감한 건강정보를 입력하기 전 개인정보 처리 방식을 반드시
                    확인해 주세요.
                  </p>
                </div>
              </div>

              <fieldset className="form-card">
                <legend>
                  <span>01</span> 오늘 진료에서 확인할 것
                </legend>
                <Field
                  id="writtenDate"
                  label="작성일"
                  value={form.writtenDate}
                  onChange={updateForm}
                  type="date"
                />
                <Field
                  id="visitGoal"
                  label="오늘 확인받고 싶은 내용"
                  value={form.visitGoal}
                  onChange={updateForm}
                  rows={3}
                  maxLength={180}
                  placeholder="예: 최근 어지럼증의 원인과 복용약 조정이 필요한지 확인하고 싶어요."
                />
              </fieldset>

              <fieldset className="form-card">
                <legend>
                  <span>02</span> 가장 불편한 증상
                </legend>
                <Field
                  id="mainSymptom"
                  label="가장 불편한 증상"
                  value={form.mainSymptom}
                  onChange={updateForm}
                  rows={3}
                  maxLength={180}
                  placeholder="예: 일어날 때 어지럽고 중심을 잡기 어려워요."
                />
                <div className="field-grid">
                  <Field
                    id="symptomStart"
                    label="증상 시작 시점"
                    value={form.symptomStart}
                    onChange={updateForm}
                    placeholder="예: 지난주 월요일부터"
                    maxLength={60}
                  />
                  <Field
                    id="occurrenceContext"
                    label="발생 상황"
                    value={form.occurrenceContext}
                    onChange={updateForm}
                    placeholder="예: 앉았다 일어날 때"
                    maxLength={100}
                  />
                  <Field
                    id="occurrencePattern"
                    label="발생 양상"
                    value={form.occurrencePattern}
                    onChange={updateForm}
                    placeholder="예: 하루 서너 번, 수초간"
                    maxLength={100}
                  />
                  <Field
                    id="worseningFactors"
                    label="악화 요인"
                    value={form.worseningFactors}
                    onChange={updateForm}
                    placeholder="예: 식사를 거른 날"
                    maxLength={100}
                  />
                  <Field
                    id="relievingFactors"
                    label="완화 요인"
                    value={form.relievingFactors}
                    onChange={updateForm}
                    placeholder="예: 잠시 앉아서 쉬면 나아짐"
                    maxLength={100}
                  />
                </div>
              </fieldset>

              <fieldset className="form-card">
                <legend>
                  <span>03</span> 증상 전후와 받은 진료
                </legend>
                <Field
                  id="beforeAfterContext"
                  label="증상 발생 전후 상황"
                  value={form.beforeAfterContext}
                  onChange={updateForm}
                  rows={4}
                  maxLength={240}
                  placeholder="예: 증상 전날 잠을 설쳤고, 이후 식사량이 줄었어요."
                />
                <Field
                  id="careReceived"
                  label="지금까지 받은 진료"
                  value={form.careReceived}
                  onChange={updateForm}
                  rows={4}
                  maxLength={240}
                  placeholder="예: 동네 의원에서 혈압을 확인했고 경과를 지켜보기로 했어요."
                />
              </fieldset>

              <fieldset className="form-card">
                <legend>
                  <span>04</span> 약·질문·가져갈 자료
                </legend>
                <Field
                  id="medications"
                  label="복용 중인 약과 건강보조제"
                  hint="한 줄에 하나씩"
                  value={form.medications}
                  onChange={updateForm}
                  rows={4}
                  maxLength={280}
                  placeholder={"예: 혈압약 — 아침 식후\n오메가3 — 저녁 식후"}
                />
                <Field
                  id="questions"
                  label="의료진께 확인할 질문"
                  hint="위에서부터 최대 3개 표시"
                  value={form.questions}
                  onChange={updateForm}
                  rows={4}
                  maxLength={300}
                  placeholder={
                    "예: 이 증상과 현재 약이 관련 있을까요?\n추가 검사가 필요할까요?"
                  }
                />
                <Field
                  id="materials"
                  label="진료 시 가져갈 자료"
                  hint="한 줄에 하나씩"
                  value={form.materials}
                  onChange={updateForm}
                  rows={3}
                  maxLength={180}
                  placeholder={"예: 복용약 봉투\n최근 혈압 측정 메모"}
                />
              </fieldset>

              <fieldset className="form-card timeline-editor">
                <legend>
                  <span>05</span> 진료 타임라인
                </legend>
                <p className="legend-description">
                  증상 시작 시점은 자동으로 반영됩니다. 그 밖의 변화나 진료를
                  시기별로 더해보세요. 같은 시기는 한 행으로 묶입니다.
                </p>
                <div className="timeline-entry-list">
                  {timelineEntries.map((entry, index) => (
                    <div className="timeline-entry" key={entry.id}>
                      <div className="timeline-entry-heading">
                        <strong>사건 {index + 1}</strong>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => removeTimelineEntry(entry.id)}
                          aria-label={`타임라인 사건 ${index + 1} 삭제`}
                        >
                          <Minus size={17} aria-hidden="true" />
                        </button>
                      </div>
                      <label htmlFor={`timeline-period-${entry.id}`}>시기</label>
                      <input
                        id={`timeline-period-${entry.id}`}
                        value={entry.period}
                        onChange={(event) =>
                          updateTimeline(entry.id, "period", event.target.value)
                        }
                        maxLength={60}
                        placeholder="예: 지난달"
                      />
                      <label htmlFor={`timeline-detail-${entry.id}`}>
                        있었던 일
                      </label>
                      <textarea
                        id={`timeline-detail-${entry.id}`}
                        value={entry.detail}
                        onChange={(event) =>
                          updateTimeline(entry.id, "detail", event.target.value)
                        }
                        rows={3}
                        maxLength={180}
                        placeholder="같은 시기의 사건은 줄을 바꿔 적어주세요."
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="add-timeline-button"
                  type="button"
                  onClick={addTimelineEntry}
                >
                  <CirclePlus size={18} aria-hidden="true" />
                  시기별 사건 추가하기
                </button>
              </fieldset>

              <div className="medical-disclaimer">
                <strong>꼭 확인해 주세요</strong>
                <p>
                  본 서비스는 진단이나 처방을 제공하지 않습니다. 작성한
                  리포트는 진료 전 정보 정리를 돕기 위한 자료이며, 의학적
                  판단은 반드시 의료진과 상의해 주세요.
                </p>
              </div>
            </form>

            <aside className="preview-pane" aria-label="진료한장 미리보기">
              <div className="preview-intro">
                <div>
                  <span className="live-dot" aria-hidden="true" />
                  실시간 미리보기
                </div>
                <p>입력한 내용만 한 장에 표시됩니다.</p>
              </div>

              <div className="report-frame">
                <article
                  className="report-sheet"
                  id="print-report"
                  ref={reportRef}
                >
                  <header className="report-header">
                    <Brand compact />
                    {form.writtenDate && (
                      <p>
                        <span>작성일</span>
                        {formatDate(form.writtenDate)}
                      </p>
                    )}
                  </header>

                  {timelineRows.length > 0 && (
                    <section className="report-timeline">
                      <div className="report-section-title">
                        <span>진료 타임라인</span>
                        <small>시간의 흐름에 따라 정리했어요</small>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th scope="col">시기</th>
                            <th scope="col">증상과 진료의 흐름</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timelineRows.map((row) => (
                            <tr key={row.period}>
                              <th scope="row">{row.period}</th>
                              <td>
                                <ul>
                                  {row.details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}

                  <div className="report-section-grid">
                    {form.visitGoal.trim() && (
                      <section className="report-section report-section-wide">
                        <h3>
                          <span>01</span> 오늘 확인받고 싶은 내용
                        </h3>
                        <p>{form.visitGoal.trim()}</p>
                      </section>
                    )}

                    {symptomDetails.length > 0 && (
                      <section className="report-section">
                        <h3>
                          <span>02</span> 현재 가장 불편한 증상
                        </h3>
                        <ul>
                          {symptomDetails.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {form.beforeAfterContext.trim() && (
                      <section className="report-section">
                        <h3>
                          <span>03</span> 증상 발생 전후 상황
                        </h3>
                        <p>{form.beforeAfterContext.trim()}</p>
                      </section>
                    )}

                    {form.careReceived.trim() && (
                      <section className="report-section">
                        <h3>
                          <span>04</span> 지금까지 받은 진료
                        </h3>
                        <p>{form.careReceived.trim()}</p>
                      </section>
                    )}

                    {medications.length > 0 && (
                      <section className="report-section">
                        <h3>
                          <span>05</span> 복용 중인 약과 건강보조제
                        </h3>
                        <ul>
                          {medications.map((medication) => (
                            <li key={medication}>{medication}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {questions.length > 0 && (
                      <section className="report-section">
                        <h3>
                          <span>06</span> 의료진께 확인할 질문
                        </h3>
                        <ul className="checklist">
                          {questions.map((question) => (
                            <li key={question}>
                              <span aria-hidden="true" />
                              {question}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {materials.length > 0 && (
                      <section className="report-section">
                        <h3>
                          <span>07</span> 진료 시 가져갈 자료
                        </h3>
                        <ul className="checklist">
                          {materials.map((material) => (
                            <li key={material}>
                              <span aria-hidden="true" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {!hasReportContent && (
                    <div className="empty-report">
                      <div>
                        <Heart size={28} aria-hidden="true" />
                      </div>
                      <strong>부모님의 이야기를 기다리고 있어요.</strong>
                      <p>
                        왼쪽에서 내용을 입력하면 이곳에 한 장으로 정리됩니다.
                      </p>
                    </div>
                  )}

                  <footer className="report-footer">
                    <p>
                      본 자료는 진료 전 정보 정리를 위한 것으로, 진단이나
                      처방을 제공하지 않습니다.
                    </p>
                    <span>부모님의 진료를 준비하는 가장 다정한 한 장</span>
                  </footer>
                </article>
              </div>

              <div className="report-actions">
                <button
                  className="button button-primary print-button"
                  type="button"
                  onClick={() => window.print()}
                >
                  <Printer size={19} aria-hidden="true" />
                  PDF로 저장하기 · 인쇄하기
                </button>
                <p>인쇄 창에서 ‘PDF로 저장’을 선택할 수 있어요.</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="beta-section landing">
          <div>
            <p className="section-kicker">BETA TESTER</p>
            <h2>
              다음 부모님 진료,
              <br />
              한 장 먼저 챙겨볼까요?
            </h2>
          </div>
          <div className="beta-copy">
            <p>
              진료한장을 먼저 사용해 보고, 부모님과 자녀 모두에게 더 편한
              서비스가 되도록 경험을 들려주세요.
            </p>
            <BetaLink className="button button-light">
              부모님 진료, 한 장 먼저 챙겨보기
              <ArrowRight size={18} aria-hidden="true" />
            </BetaLink>
            <small>유료 가입이나 결제가 아닌 베타테스터 신청입니다.</small>
          </div>
        </section>
      </main>

      <footer className="site-footer landing">
        <Brand compact />
        <p>부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장</p>
        <span>진단·처방이 아닌 진료 전 정보 정리 서비스</span>
      </footer>
    </div>
  );
}

export default App;
