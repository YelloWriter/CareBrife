import "server-only";
import { after } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { BUCKET, cleanupFiles, database, getTemplate } from "./server";
import {
  MAX_IMAGE_BYTES,
  TemplateError,
  isUUID,
  validateFields,
} from "./schema";

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  let valid = false;
  try {
    const parsed = new URL(origin || "");
    // Next can use its internal hostname in request.url. Host is the browser's
    // actual target; browsers cannot override it in a cross-origin form/fetch.
    valid =
      ["https:", "http:"].includes(parsed.protocol) &&
      parsed.host === request.headers.get("host") &&
      request.headers.get("sec-fetch-site") !== "cross-site";
  } catch {
    /* Missing or malformed Origin. */
  }
  if (!valid)
    throw new TemplateError(
      "이 사이트의 입력 화면에서 다시 시도해 주세요.",
      403,
    );
}
export async function readForm(request: Request) {
  // Also bound actual streamed bytes; Content-Length alone can be forged/absent.
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    throw new TemplateError("입력 형식을 확인해 주세요.", 400);
  const max = MAX_IMAGE_BYTES + 64000;
  const reader = request.body?.getReader();
  if (!reader) throw new TemplateError("입력 내용이 없어요.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new TemplateError("이미지는 2MB 이하로 선택해 주세요.", 413);
    }
    chunks.push(value);
  }
  try {
    return await new Response(new Blob(chunks as BlobPart[]), {
      headers: { "Content-Type": request.headers.get("content-type")! },
    }).formData();
  } catch {
    throw new TemplateError(
      "입력 내용을 읽지 못했어요. 다시 시도해 주세요.",
      400,
    );
  }
}
async function imageBytes(file: File) {
  if (file.size > MAX_IMAGE_BYTES)
    throw new TemplateError("이미지는 2MB 이하로 선택해 주세요.", 400, {
      image: "2MB 이하의 이미지를 선택해 주세요.",
    });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png =
    bytes.length >= 24 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  const jpeg =
    bytes.length >= 4 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255;
  const webp =
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const type = png
    ? "image/png"
    : jpeg
      ? "image/jpeg"
      : webp
        ? "image/webp"
        : "";
  if (!type || type !== file.type)
    throw new TemplateError("PNG, JPG, WebP 이미지만 올릴 수 있어요.", 400, {
      image: "파일 내용과 형식이 일치하는 PNG, JPG, WebP를 선택해 주세요.",
    });
  try {
    const clean = await sharp(bytes, {
      limitInputPixels: 16000000,
      failOn: "warning",
    })
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
    return { bytes: clean, type: "image/webp", ext: "webp" };
  } catch {
    throw new TemplateError(
      "이미지를 읽지 못했어요. 다른 PNG, JPG, WebP 파일을 선택해 주세요.",
      400,
      { image: "손상되지 않은 1,600만 화소 이하 이미지를 선택해 주세요." },
    );
  }
}
export async function saveTemplate(
  data: FormData,
  id: string,
  creating: boolean,
) {
  if (!isUUID(id))
    throw new TemplateError("템플릿 주소가 올바르지 않아요.", 400);
  const { values, errors } = validateFields(data);
  const file = data.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;
  if (image && !values.image_alt)
    errors.image_alt = "이미지를 설명하는 글을 입력해 주세요.";
  if (Object.keys(errors).length)
    throw new TemplateError("입력 항목을 확인해 주세요.", 400, errors);
  const version = Number(data.get("version"));
  if (!creating && (!Number.isInteger(version) || version < 1))
    throw new TemplateError("최신 내용을 다시 불러온 뒤 수정해 주세요.", 409);
  const previous = creating ? null : await getTemplate(id);
  if (!creating && !previous)
    throw new TemplateError("이미 삭제된 템플릿이에요.", 404);
  if (previous && previous.version !== version)
    throw new TemplateError(
      "다른 변경 사항이 있어요. 새로고침 후 다시 수정해 주세요.",
      409,
    );
  let path =
    data.get("remove_image") === "on" ? null : previous?.image_path || null;
  if (path && !values.image_alt && !image)
    throw new TemplateError("이미지 설명을 입력해 주세요.", 400, {
      image_alt: "이미지 설명을 입력해 주세요.",
    });
  const checkedImage = image ? await imageBytes(image) : null;
  const db = database();
  let uploaded: string | null = null;
  if (checkedImage) {
    await cleanupFiles();
    uploaded = `${id}/${randomUUID()}.${checkedImage.ext}`;
    // If upload succeeds but the request dies, this durable candidate is reclaimable.
    const { error: queueError } = await db
      .from("template_file_cleanup")
      .insert({ path: uploaded });
    if (queueError)
      throw new TemplateError(
        "이미지 저장 요청이 많아요. 잠시 후 다시 시도하거나 이미지 없이 저장해 주세요.",
      );
    const { error } = await db.storage
      .from(BUCKET)
      .upload(uploaded, checkedImage.bytes, {
        contentType: checkedImage.type,
        upsert: false,
      });
    if (error)
      throw new TemplateError(
        "이미지를 올리지 못했어요. 입력은 유지되어 있어요. 다시 시도하거나 이미지 없이 저장해 주세요.",
      );
    path = uploaded;
  }
  const { error } = await db.rpc("save_preparation_template", {
    p_id: id,
    p_version: creating ? 0 : version,
    p_title: values.title,
    p_category: values.category,
    p_summary: values.summary,
    p_checklist: values.checklist,
    p_image_path: path,
    p_image_alt: path ? values.image_alt : null,
  });
  if (error) {
    // Keep upload candidates on their grace period: a network error may follow a committed DB write.
    after(cleanupFiles);
    if (error.message.includes("TEMPLATE_LIMIT"))
      throw new TemplateError(
        "무료 체험 저장 공간이 가득 찼어요. 필요 없는 예시를 삭제한 후 다시 시도해 주세요.",
        409,
      );
    if (error.message.includes("VERSION_CONFLICT") || error.code === "23505")
      throw new TemplateError(
        "이미 저장됐거나 다른 변경 사항이 있어요. 목록에서 최신 내용을 확인해 주세요.",
        409,
      );
    throw new TemplateError(
      "저장 결과를 확인하지 못했어요. 목록에서 확인한 후 다시 시도해 주세요.",
    );
  }
  after(cleanupFiles);
  return id;
}
export function apiError(error: unknown) {
  const known = error instanceof TemplateError;
  return Response.json(
    {
      error: known ? error.message : "연결을 확인하고 다시 시도해 주세요.",
      fields: known ? error.fields : undefined,
    },
    { status: known ? error.status : 503 },
  );
}
