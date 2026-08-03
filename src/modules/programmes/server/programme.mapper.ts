import type { Tables } from "@/types/database";
import type { ProgrammeSummary } from "@/modules/programmes/types";
export type ProgrammeRow=Tables<"programmes">;
export function mapProgramme(row:ProgrammeRow):ProgrammeSummary{return{id:row.id,name:row.name,slug:row.slug,description:row.description,status:row.status,createdAt:row.created_at,updatedAt:row.updated_at};}
