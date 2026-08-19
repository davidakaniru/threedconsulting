import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { nullableText } from "@/lib/mappers";
import { normalizePagination } from "@/lib/modules";
import type {
  CreateProgrammeRequest,
  UpdateProgrammeRequest,
} from "@/modules/programmes/schemas";
import type {
  ProgrammeDetail,
  ProgrammeListResult,
  ProgrammeMetricsI,
} from "@/modules/programmes/types";
import { mapProgramme, type ProgrammeRow } from "./programme.mapper";
import * as repo from "./programme.repository";
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export async function getProgrammes(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<ProgrammeListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  const { data, error, count } = await repo.listProgrammeRows(
    from,
    to,
    params.search,
    params.status,
  );
  if (error)
    throw new ApiError(
      "PROGRAMMES_LOAD_FAILED",
      "Programmes could not be loaded.",
      500,
    );
  return {
    programmes: ((data ?? []) as ProgrammeRow[]).map(mapProgramme),
    total: count ?? 0,
    page,
    pageSize,
  };
}
export async function getProgramme(id: string): Promise<ProgrammeDetail> {
  const { data, error } = await repo.getProgrammeRow(id);
  if (error)
    throw new ApiError(
      "PROGRAMME_LOAD_FAILED",
      "The programme could not be loaded.",
      500,
    );
  if (!data)
    throw new ApiError("PROGRAMME_NOT_FOUND", "Programme not found.", 404);
  return mapProgramme(data as ProgrammeRow);
}
export async function getProgrammeMetrics(): Promise<ProgrammeMetricsI> {
  const [total, draft, published, archived] = await Promise.all([
    repo.getProgrammeCount(),
    repo.getProgrammeCount("draft"),
    repo.getProgrammeCount("published"),
    repo.getProgrammeCount("archived"),
  ]);
  const failed = [total, draft, published, archived].find((x) => x.error);
  if (failed?.error)
    throw new ApiError(
      "PROGRAMME_METRICS_FAILED",
      "Programme metrics could not be loaded.",
      500,
    );
  return {
    total: total.count ?? 0,
    draft: draft.count ?? 0,
    published: published.count ?? 0,
    archived: archived.count ?? 0,
  };
}
function input(values: CreateProgrammeRequest | UpdateProgrammeRequest) {
  return {
    // Title is required by the repository/type; fall back to name if not provided
    title: (values as any).title?.trim() ?? values.name.trim(),
    name: values.name.trim(),
    slug: slugify(values.name),
    description: nullableText(values.description),
    status: values.status,
  };
}
export async function createProgramme(
  values: CreateProgrammeRequest,
  actorId: string,
) {
  const { data, error } = await repo.insertProgramme({
    ...input(values),
    created_by: actorId,
  });
  if (error || !data) {
    if (error?.code === "23505")
      throw new ApiError(
        "PROGRAMME_EXISTS",
        "A programme with this name already exists.",
        409,
      );
    throw new ApiError(
      "PROGRAMME_CREATE_FAILED",
      "The programme could not be created.",
      500,
    );
  }
  await writeAuditLog({
    actorId,
    action: "programme.created",
    entityType: "programme",
    entityId: data.id,
    metadata: { name: data.name, status: data.status },
  });
  return mapProgramme(data as ProgrammeRow);
}
export async function updateProgramme(
  id: string,
  values: UpdateProgrammeRequest,
  actorId: string,
) {
  await getProgramme(id);
  const { data, error } = await repo.updateProgrammeRow(id, input(values));
  if (error || !data) {
    if (error?.code === "23505")
      throw new ApiError(
        "PROGRAMME_EXISTS",
        "A programme with this name already exists.",
        409,
      );
    throw new ApiError(
      "PROGRAMME_UPDATE_FAILED",
      "The programme could not be updated.",
      500,
    );
  }
  await writeAuditLog({
    actorId,
    action: "programme.updated",
    entityType: "programme",
    entityId: id,
    metadata: { name: data.name, status: data.status },
  });
  return mapProgramme(data as ProgrammeRow);
}
