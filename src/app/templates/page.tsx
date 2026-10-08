import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATEGORIES, TemplateError } from "@/lib/templates/schema";
import { listTemplates } from "@/lib/templates/server";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const category =
    typeof params.category === "string" &&
    CATEGORIES.includes(params.category as (typeof CATEGORIES)[number])
      ? params.category
      : "";
  const page =
    typeof params.page === "string" && /^[1-9]\d{0,5}$/.test(params.page)
      ? Number(params.page)
      : 1;
  const href = (number: number) =>
    `/templates/?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), page: String(number) })}`;
  let result;
  let error = "";
  try {
    result = await listTemplates(page, q, category);
  } catch (e) {
    error =
      e instanceof TemplateError
        ? e.message
        : "목록에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }
  return (
    <>
      <div className="template-intro">
        <p className="template-eyebrow">A LITTLE PREPARATION</p>
        <h1>
          진료 전, 무엇부터
          <br />
          준비하면 좋을까요?
        </h1>
        <p>
          누구나 사용할 수 있는 준비 항목과 질문 예시를
          <br className="template-desktop-break" /> 모으고, 함께 다듬는
          공간이에요.
        </p>
        <Button asChild size="landing">
          <Link href="/templates/new/">새 템플릿 만들기</Link>
        </Button>
      </div>
      <div className="template-notice">
        <strong>공개 예시 체험 공간</strong>
        <p>
          누구나 조회·수정·삭제할 수 있어요. 실제 개인정보와 건강정보를 저장하지
          마세요. 내 진료 내용은 ‘진료한장 만들기’에서 기기 안에서 정리할 수
          있어요.
        </p>
      </div>
      {params.deleted === "1" && (
        <p className="template-success" role="status">
          템플릿을 삭제했어요.
        </p>
      )}
      <form className="template-search" action="/templates/">
        <div>
          <label htmlFor="q">제목으로 검색</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            maxLength={60}
            placeholder="찾고 싶은 준비 항목"
          />
        </div>
        <div>
          <label htmlFor="filter-category">분류</label>
          <select id="filter-category" name="category" defaultValue={category}>
            <option value="">전체</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <Button type="submit">찾기</Button>
        {(q || category) && <Link href="/templates/">초기화</Link>}
      </form>
      {error ? (
        <div className="template-error" role="alert">
          <h2>잠시 연결이 어려워요</h2>
          <p>{error}</p>
          <Button asChild variant="outline">
            <a href={href(page)}>다시 불러오기</a>
          </Button>
        </div>
      ) : (
        result && (
          <>
            <p className="template-count">총 {result.total}개 · 최신 등록순</p>
            {!result.items.length ? (
              <Card className="template-empty">
                <h2>
                  {q || category
                    ? "검색 결과가 없어요"
                    : "아직 등록된 템플릿이 없어요"}
                </h2>
                <p>
                  {q || category
                    ? "다른 검색어나 분류로 찾아보세요."
                    : "함께 사용할 첫 준비 목록을 만들어 보세요."}
                </p>
                <Link href={q || category ? "/templates/" : "/templates/new/"}>
                  {q || category ? "전체 목록 보기" : "첫 템플릿 만들기"} →
                </Link>
              </Card>
            ) : (
              <div className="template-grid">
                {result.items.map((t) => (
                  <Card key={t.id} className="template-card">
                    <span className="template-badge">{t.category}</span>
                    <h2>
                      <Link href={`/templates/${t.id}/`}>{t.title}</Link>
                    </h2>
                    <p>{t.summary}</p>
                    <div className="template-card-bottom">
                      <span>
                        {t.image_path ? "예시 이미지 첨부" : "텍스트 템플릿"}
                      </span>
                      <Link
                        href={`/templates/${t.id}/`}
                        aria-label={`${t.title} 자세히 보기`}
                      >
                        자세히 보기 →
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <nav className="template-pagination" aria-label="목록 페이지">
              {result.current > 1 && (
                <Link href={href(result.current - 1)}>← 이전</Link>
              )}
              <span aria-current="page">
                {result.current} / {result.pages}
              </span>
              {result.current < result.pages && (
                <Link href={href(result.current + 1)}>다음 →</Link>
              )}
            </nav>
          </>
        )
      )}
    </>
  );
}
