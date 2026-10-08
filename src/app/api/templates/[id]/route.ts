import {
  apiError,
  checkOrigin,
  readForm,
  saveTemplate,
} from "@/lib/templates/mutations";
import { cleanupFiles, database } from "@/lib/templates/server";
import { TemplateError, isUUID } from "@/lib/templates/schema";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    checkOrigin(request);
    const { id } = await params;
    await saveTemplate(await readForm(request), id, false);
    return Response.json({ id });
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    checkOrigin(request);
    const { id } = await params;
    const version = Number(request.headers.get("if-match"));
    if (!isUUID(id) || !Number.isInteger(version) || version < 1)
      throw new TemplateError("삭제할 항목을 다시 확인해 주세요.", 400);
    const { data, error } = await database()
      .from("preparation_templates")
      .delete()
      .eq("id", id)
      .eq("version", version)
      .select("id");
    if (error)
      throw new TemplateError("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    if (!data?.length)
      throw new TemplateError(
        "이미 삭제됐거나 수정된 항목이에요. 목록에서 확인해 주세요.",
        409,
      );
    await cleanupFiles();
    return Response.json({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
