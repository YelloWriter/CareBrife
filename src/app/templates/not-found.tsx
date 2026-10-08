import Link from "next/link";
export default function NotFound() {
  return (
    <div className="template-empty">
      <h1>템플릿을 찾을 수 없어요</h1>
      <p>주소가 잘못됐거나 이미 삭제된 항목이에요.</p>
      <Link href="/templates/">템플릿 목록으로 돌아가기 →</Link>
    </div>
  );
}
