"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  MAX_IMAGE_BYTES,
  validateFields,
  type FieldErrors,
  type Template,
} from "@/lib/templates/schema";
import { TemplateImage } from "./TemplateImage";

export function TemplateForm({
  initial,
  newId,
}: {
  initial?: Template;
  newId?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [remove, setRemove] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (message) errorRef.current?.focus();
  }, [message, errors]);
  const showError = (field: keyof FieldErrors) =>
    errors[field] ? (
      <p id={`${field}-error`} className="template-field-error">
        {errors[field]}
      </p>
    ) : null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const validated = validateFields(data);
    const hasImage = file || (initial?.image_path && !remove);
    if (hasImage && !validated.values.image_alt)
      validated.errors.image_alt = "이미지를 설명하는 글을 입력해 주세요.";
    if (Object.keys(validated.errors).length) {
      setErrors(validated.errors);
      setMessage("입력 항목을 확인해 주세요.");
      return;
    }
    setErrors({});
    setMessage("");
    busy.current = true;
    setPending(true);
    data.set("id", initial?.id || newId!);
    if (initial) data.set("version", String(initial.version));
    try {
      const response = await fetch(
        initial ? `/api/templates/${initial.id}/` : "/api/templates/",
        { method: initial ? "PATCH" : "POST", body: data },
      );
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.fields || {});
        setMessage(result.error || "저장하지 못했어요.");
        return;
      }
      router.push(
        `/templates/${result.id}/?saved=${initial ? "updated" : "created"}`,
      );
      router.refresh();
    } catch {
      setMessage(
        "연결이 끊어져 저장 결과를 확인하지 못했어요. 목록에서 확인한 후 다시 시도해 주세요. 입력 내용은 유지됩니다.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <form
      method="post"
      onSubmit={submit}
      className="template-form"
      noValidate
      aria-busy={pending}
    >
      <div className="template-notice">
        <strong>공개 예시를 함께 만드는 공간이에요.</strong>
        <p>
          누구나 조회·수정·삭제할 수 있습니다. 실제 이름, 연락처, 증상,
          복용약이나 진료 기록은 입력하지 마세요.
        </p>
      </div>
      {message && (
        <div
          ref={errorRef}
          tabIndex={-1}
          className="template-error"
          role="alert"
        >
          {message} <Link href="/templates/">목록 확인하기</Link>
        </div>
      )}
      <fieldset disabled={pending}>
        <div className="template-field">
          <label htmlFor="title">
            템플릿 제목 <span>(필수 · 2~60자)</span>
          </label>
          <input
            id="title"
            name="title"
            defaultValue={initial?.title}
            maxLength={60}
            placeholder="예: 진료 전에 챙길 것"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {showError("title")}
        </div>
        <div className="template-field">
          <label htmlFor="category">
            분류 <span>(필수)</span>
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initial?.category || ""}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            <option value="">분류를 선택해 주세요</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {showError("category")}
        </div>
        <div className="template-field">
          <label htmlFor="summary">
            짧은 설명 <span>(필수 · 5~200자)</span>
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            maxLength={200}
            defaultValue={initial?.summary}
            placeholder="언제 사용하는 준비 목록인지 알려 주세요."
            aria-invalid={!!errors.summary}
            aria-describedby={errors.summary ? "summary-error" : undefined}
          />
          {showError("summary")}
        </div>
        <div className="template-field">
          <label htmlFor="checklist">
            준비 항목 <span>(필수 · 5~2,000자)</span>
          </label>
          <textarea
            id="checklist"
            name="checklist"
            rows={8}
            maxLength={2000}
            defaultValue={initial?.checklist}
            placeholder={
              "예약 시간과 위치 확인하기\n궁금한 질문을 미리 적기\n필요한 준비물 확인하기"
            }
            aria-invalid={!!errors.checklist}
            aria-describedby={
              errors.checklist
                ? "checklist-help checklist-error"
                : "checklist-help"
            }
          />
          <p id="checklist-help" className="template-hint">
            한 줄에 한 항목씩 적어 주세요. 특정 사람의 기록 대신 누구나 사용할
            수 있는 예시를 작성해요.
          </p>
          {showError("checklist")}
        </div>
        <div className="template-field">
          <label htmlFor="image">
            예시 이미지 <span>(선택 · PNG/JPG/WebP · 2MB 이하)</span>
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-describedby={
              errors.image ? "image-help image-error" : "image-help"
            }
            aria-invalid={!!errors.image}
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (
                picked &&
                (picked.size > MAX_IMAGE_BYTES ||
                  !["image/png", "image/jpeg", "image/webp"].includes(
                    picked.type,
                  ))
              ) {
                setErrors((prev) => ({
                  ...prev,
                  image: "2MB 이하의 PNG, JPG, WebP 이미지를 선택해 주세요.",
                }));
                e.target.value = "";
                setFile(null);
                return;
              }
              setErrors((prev) => ({ ...prev, image: undefined }));
              setFile(picked || null);
            }}
          />
          <p id="image-help" className="template-hint">
            직접 만든 준비물 그림 등만 올려 주세요. 얼굴·처방전·검사 결과 사진은
            올리지 마세요.
          </p>
          {showError("image")}
          {preview ? (
            <img
              className="template-image"
              src={preview}
              alt="선택한 이미지 미리보기"
            />
          ) : initial?.image_path && !remove ? (
            <TemplateImage
              id={initial.id}
              version={initial.version}
              alt={initial.image_alt || "예시 이미지"}
            />
          ) : (
            <p className="template-empty-image">
              이미지 없이도 저장할 수 있어요.
            </p>
          )}
          {initial?.image_path && (
            <label className="template-check">
              <input
                type="checkbox"
                name="remove_image"
                checked={remove}
                onChange={(e) => setRemove(e.target.checked)}
              />
              기존 이미지 삭제 {file && "(새 이미지를 선택하면 교체돼요)"}
            </label>
          )}
        </div>
        <div className="template-field">
          <label htmlFor="image_alt">
            이미지 설명 <span>(이미지가 있을 때 필수 · 최대 120자)</span>
          </label>
          <input
            id="image_alt"
            name="image_alt"
            maxLength={120}
            defaultValue={initial?.image_alt || ""}
            placeholder="예: 메모장과 펜을 그린 준비물 그림"
            aria-invalid={!!errors.image_alt}
            aria-describedby={errors.image_alt ? "image_alt-error" : undefined}
          />
          {showError("image_alt")}
        </div>
        <label className="template-check">
          <input
            type="checkbox"
            name="consent"
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          실제 개인정보·건강정보 없이 공개용 예시만 작성했어요.
        </label>
        {showError("consent")}
        <div className="template-actions">
          <Button type="submit" size="landing">
            {pending ? "저장 중…" : initial ? "수정 내용 저장" : "템플릿 등록"}
          </Button>
          {!pending && (
            <Button asChild variant="outline">
              <Link
                href={initial ? `/templates/${initial.id}/` : "/templates/"}
              >
                취소
              </Link>
            </Button>
          )}
        </div>
      </fieldset>
      <p role="status" className="template-hint">
        {pending
          ? "이미지와 내용을 저장하고 있어요. 잠시만 기다려 주세요."
          : "최대 100개의 예시를 함께 사용할 수 있어요."}
      </p>
    </form>
  );
}
