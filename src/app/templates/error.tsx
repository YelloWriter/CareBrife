"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="template-empty" role="alert">
      <h1>내용을 불러오지 못했어요</h1>
      <p>
        잠시 후 다시 시도해 주세요. 작성 도구는 홈에서 계속 이용할 수 있어요.
      </p>
      <div className="template-actions">
        <Button onClick={reset}>다시 시도</Button>
        <Link href="/templates/">목록으로</Link>
      </div>
    </div>
  );
}
