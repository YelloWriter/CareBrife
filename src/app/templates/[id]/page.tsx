import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTemplate } from "@/lib/templates/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteTemplate } from "@/components/templates/DeleteTemplate";
import { TemplateImage } from "@/components/templates/TemplateImage";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const row = await getTemplate((await params).id);
    if (row)
      return {
        title: `${row.title} | 진료한장 준비 템플릿`,
        description: row.summary,
        openGraph: {
          title: row.title,
          description: row.summary,
          images: ["/og.png"],
        },
      };
  } catch {
    /* page error boundary owns recovery */
  }
  return { title: "준비 템플릿 | 진료한장" };
}
export default async function Page({ params, searchParams }: Props) {
  const row = await getTemplate((await params).id);
  if (!row) notFound();
  const saved = (await searchParams).saved;
  return (
    <>
      <Link className="template-back" href="/templates/">
        ← 템플릿 목록
      </Link>
      {(saved === "created" || saved === "updated") && (
        <p role="status" className="template-success">
          {saved === "created"
            ? "템플릿을 등록했어요."
            : "수정한 내용을 저장했어요."}
        </p>
      )}
      <article>
        <div className="template-page-heading">
          <span className="template-badge">{row.category}</span>
          <h1>{row.title}</h1>
          <p>{row.summary}</p>
          <small>
            최근 수정{" "}
            {new Date(row.updated_at).toLocaleDateString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </small>
        </div>
        <Card className="template-detail">
          <h2>미리 챙겨 보세요</h2>
          <ul className="template-checklist">
            {row.checklist
              .split("\n")
              .filter((line) => line.trim())
              .map((line, i) => (
                <li key={i}>
                  <span aria-hidden="true">✓</span>
                  {line}
                </li>
              ))}
          </ul>
        </Card>
        <Card className="template-detail">
          <h2>예시 이미지</h2>
          {row.image_path ? (
            <TemplateImage
              id={row.id}
              version={row.version}
              alt={row.image_alt || "준비 항목 예시"}
            />
          ) : (
            <p className="template-empty-image">첨부된 이미지가 없어요.</p>
          )}
        </Card>
      </article>
      <div className="template-actions">
        <Button asChild>
          <Link href={`/templates/${row.id}/edit/`}>수정하기</Link>
        </Button>
        <DeleteTemplate id={row.id} version={row.version} />
        <Button asChild variant="outline">
          <Link href="/templates/">목록</Link>
        </Button>
      </div>
      <div className="template-notice">
        <strong>이 준비 목록을 참고해 내 진료한장도 만들어 보세요.</strong>
        <p>
          내 진료 내용은 이 공개 템플릿에 입력하지 않고, 작성 도구에서 별도로
          정리해요.
        </p>
        <Link href="/#create-report">진료한장 만들기 →</Link>
      </div>
    </>
  );
}
