import type { Enums } from "@/types/database";
export type ProgrammeStatus = Enums<"programme_status">;
export interface ProgrammeSummary { id:string; name:string; slug:string; description:string|null; status:ProgrammeStatus; createdAt:string; updatedAt:string; }
export type ProgrammeDetail = ProgrammeSummary;
export interface ProgrammeListResult { programmes:ProgrammeSummary[]; total:number; page:number; pageSize:number; }
export interface ProgrammeMetricsI { total:number; draft:number; published:number; archived:number; }
