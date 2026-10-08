"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function DeleteTemplate({
  id,
  version,
}: {
  id: string;
  version: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/templates/${id}/`, {
        method: "DELETE",
        headers: { "If-Match": String(version) },
      });
      if (!res.ok) {
        const result = await res.json();
        setError(result.error);
        return;
      }
      dialog.current?.close();
      router.push("/templates/?deleted=1");
      router.refresh();
    } catch {
      setError(
        "삭제 결과를 확인하지 못했어요. 목록에서 확인한 후 다시 시도해 주세요.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        삭제
      </Button>
      <dialog
        ref={dialog}
        className="template-dialog"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        onCancel={(e) => {
          if (pending) e.preventDefault();
        }}
      >
        <h2 id="delete-title">템플릿을 삭제할까요?</h2>
        <p id="delete-description">
          내용과 첨부 이미지는 다시 되돌릴 수 없어요.
        </p>
        {error && (
          <p className="template-error" role="alert">
            {error}
          </p>
        )}
        <div className="template-actions">
          <Button
            variant="outline"
            autoFocus
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            취소
          </Button>
          <Button variant="destructive" disabled={pending} onClick={remove}>
            {pending ? "삭제 중…" : "삭제하기"}
          </Button>
        </div>
      </dialog>
    </>
  );
}
