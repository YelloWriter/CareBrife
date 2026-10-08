export const CATEGORIES = ["진료 전 준비", "질문 정리", "동행 체크"] as const;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const PAGE_SIZE = 6;
export type Template = {
  id: string;
  title: string;
  category: string;
  summary: string;
  checklist: string;
  image_path: string | null;
  image_alt: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};
export type Fields = Pick<
  Template,
  "title" | "category" | "summary" | "checklist"
> & { image_alt: string };
export type FieldErrors = Partial<
  Record<keyof Fields | "image" | "consent", string>
>;
export const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
export function validateFields(data: FormData): {
  values: Fields;
  errors: FieldErrors;
} {
  const read = (name: string) =>
    typeof data.get(name) === "string" ? (data.get(name) as string).trim() : "";
  const values: Fields = {
    title: read("title"),
    category: read("category"),
    summary: read("summary"),
    checklist: read("checklist"),
    image_alt: read("image_alt"),
  };
  const errors: FieldErrors = {};
  for (const [name, label, min, max] of [
    ["title", "제목", 2, 60],
    ["summary", "설명", 5, 200],
    ["checklist", "준비 항목", 5, 2000],
  ] as const) {
    if (values[name].length < min || values[name].length > max)
      errors[name] = `${label}은 ${min}~${max}자로 입력해 주세요.`;
  }
  if (!CATEGORIES.includes(values.category as (typeof CATEGORIES)[number]))
    errors.category = "분류를 선택해 주세요.";
  if (values.image_alt.length > 120)
    errors.image_alt = "이미지 설명은 120자 이내로 입력해 주세요.";
  if (read("consent") !== "on")
    errors.consent = "공개 예시만 작성했는지 확인해 주세요.";
  return { values, errors };
}
export class TemplateError extends Error {
  constructor(
    message: string,
    public status = 503,
    public fields?: FieldErrors,
  ) {
    super(message);
  }
}
