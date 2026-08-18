import type { Enums } from "@/types/database";

export type ProgrammeStatus = Enums<"programme_status">;

export interface ProgrammeSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  overview: string;
  outcomes: string[];
  status: ProgrammeStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProgrammeDetail = ProgrammeSummary;
export interface ProgrammeListResult {
  programmes: ProgrammeSummary[];
  total: number;
  page: number;
  pageSize: number;
}
export interface ProgrammeMetricsI {
  total: number;
  draft: number;
  published: number;
  archived: number;
}
