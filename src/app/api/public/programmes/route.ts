import { apiError, apiSuccess } from "@/lib/api/responses";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data, error } = await createAdminClient()
      .from("programmes")
      .select("id,title,slug,description,cover_image_url,overview,outcomes")
      .eq("status", "published")
      .order("title");

    if (error) throw error;

    return apiSuccess(
      (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        coverImageUrl: row.cover_image_url,
        overview: row.overview,
        outcomes: Array.isArray(row.outcomes)
          ? row.outcomes.filter((v): v is string => typeof v === "string")
          : [],
      })),
    );
  } catch (e) {
    console.error("Public programmes GET failed", e);
    return apiError("PROGRAMMES_LOAD_FAILED", "Programmes could not be loaded.", 500);
  }
}
