import type { Tables } from "@/types/database";
import type { ProgrammeSummary } from "@/modules/programmes/types";

export type ProgrammeRow = Tables<"programmes">;

export function mapProgramme(row: ProgrammeRow): ProgrammeSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    overview: row.overview,
    outcomes: Array.isArray(row.outcomes) ? row.outcomes.filter((v): v is string => typeof v === "string") : [],
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
