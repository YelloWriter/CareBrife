import { randomUUID } from "node:crypto";
import Link from "next/link";
import { TemplateForm } from "@/components/templates/TemplateForm";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <>
      <Link className="template-back" href="/templates/">
        ← 템플릿 목록
      </Link>
      <div className="template-page-heading">
        <p className="template-eyebrow">MAKE A TEMPLATE</p>
        <h1>함께 쓸 준비 목록 만들기</h1>
        <p>작은 준비가 진료 전 마음을 한결 편하게 해 줘요.</p>
      </div>
      <TemplateForm newId={randomUUID()} />
    </>
  );
}
