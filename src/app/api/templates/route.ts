import {
  apiError,
  checkOrigin,
  readForm,
  saveTemplate,
} from "@/lib/templates/mutations";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const form = await readForm(request);
    const id = await saveTemplate(form, String(form.get("id") || ""), true);
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
