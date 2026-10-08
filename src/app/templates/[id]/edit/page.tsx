import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates/server";
import { TemplateForm } from "@/components/templates/TemplateForm";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const row = await getTemplate((await params).id);
  if (!row) notFound();
  return (
    <>
      <Link className="template-back" href={`/templates/${row.id}/`}>
        ← 템플릿 상세
      </Link>
      <div className="template-page-heading">
        <p className="template-eyebrow">EDIT A TEMPLATE</p>
        <h1>준비 목록 다듬기</h1>
        <p>필요한 항목을 더하거나 문장을 알기 쉽게 바꿔 주세요.</p>
      </div>
      <TemplateForm initial={row} />
    </>
  );
}
