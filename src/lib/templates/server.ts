import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { PAGE_SIZE, TemplateError, isUUID, type Template } from "./schema";
export const BUCKET = "template-examples";
export function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key)
    throw new TemplateError(
      "템플릿 저장소를 연결하는 중이에요. 잠시 후 다시 방문해 주세요.",
    );
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options) =>
        fetch(url, {
          ...options,
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        }),
    },
  });
}
export const getTemplate = cache(
  async (id: string): Promise<Template | null> => {
    if (!isUUID(id)) return null;
    const { data, error } = await database()
      .from("preparation_templates")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error)
      throw new TemplateError(
        "템플릿을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    return data as Template | null;
  },
);
export async function listTemplates(page: number, q: string, category: string) {
  const db = database();
  const makeQuery = () => {
    let query = db
      .from("preparation_templates")
      .select("*", { count: "exact" });
    if (q) query = query.ilike("title", `%${q.replace(/[\\%_]/g, "\\$&")}%`);
    if (category) query = query.eq("category", category);
    return query;
  };
  const { count, error: countError } = await makeQuery().limit(0);
  if (countError)
    throw new TemplateError(
      "목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  const pages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));
  const current = Math.min(page, pages);
  const { data, error } = await makeQuery()
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range((current - 1) * PAGE_SIZE, current * PAGE_SIZE - 1);
  if (error)
    throw new TemplateError(
      "목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    );
  return {
    items: (data || []) as Template[],
    total: count || 0,
    pages,
    current,
  };
}
// Storage and Postgres cannot share a transaction. SQL queues old files atomically;
// failed removals stay queued and are retried by the next successful mutation.
export async function cleanupFiles() {
  try {
    const db = database();
    const { data } = await db
      .from("template_file_cleanup")
      .select("path")
      .lte("ready_at", new Date().toISOString())
      .limit(10);
    const paths = (data || []).map((row) => row.path as string);
    if (!paths.length) return;
    const { data: references, error: referenceError } = await db
      .from("preparation_templates")
      .select("image_path")
      .in("image_path", paths);
    if (referenceError) return;
    const protectedPaths = new Set(
      (references || []).map((row) => row.image_path),
    );
    const removable = paths.filter((path) => !protectedPaths.has(path));
    const { error } = removable.length
      ? await db.storage.from(BUCKET).remove(removable)
      : { error: null };
    const finished = error
      ? paths.filter((path) => protectedPaths.has(path))
      : paths;
    if (finished.length)
      await db.from("template_file_cleanup").delete().in("path", finished);
  } catch {
    /* Durable queue is retried on a later mutation. */
  }
}
