import { createAdminClient } from "@/lib/supabase/admin";

export interface PublicProgramme {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string;
  overview: string;
  outcomes: string[];
}

export async function getPublishedProgrammesForPublic(): Promise<PublicProgramme[]> {
  const { data, error } = await createAdminClient()
    .from("programmes")
    .select("id,slug,title,name,description,cover_image_url,overview,outcomes")
    .eq("status", "published")
    .order("title", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title || row.name,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    overview: row.overview,
    outcomes: Array.isArray(row.outcomes) ? row.outcomes.filter((item): item is string => typeof item === "string") : [],
  }));
}

export async function getPublishedProgrammeBySlugForPublic(
  slug: string,
): Promise<PublicProgramme | null> {
  const { data, error } = await createAdminClient()
    .from("programmes")
    .select("id,slug,title,name,description,cover_image_url,overview,outcomes")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title || data.name,
    description: data.description,
    coverImageUrl: data.cover_image_url,
    overview: data.overview,
    outcomes: Array.isArray(data.outcomes)
      ? data.outcomes.filter((item): item is string => typeof item === "string")
      : [],
  };
}
