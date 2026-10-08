import { BUCKET, database, getTemplate } from "@/lib/templates/server";
import { apiError } from "@/lib/templates/mutations";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const row = await getTemplate((await params).id);
    if (!row?.image_path) return new Response(null, { status: 404 });
    const { data, error } = await database()
      .storage.from(BUCKET)
      .download(row.image_path);
    if (error || !data) return new Response(null, { status: 503 });
    return new Response(data, {
      headers: {
        "Content-Type": data.type,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
