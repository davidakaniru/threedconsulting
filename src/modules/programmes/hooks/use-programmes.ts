"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  CreateProgrammeRequest,
  UpdateProgrammeRequest,
} from "@/modules/programmes/schemas";
import type {
  ProgrammeDetail,
  ProgrammeListResult,
} from "@/modules/programmes/types";
export type ProgrammeListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};
export function useProgrammes(params: ProgrammeListParams) {
  return useQuery({
    queryKey: queryKeys.programmes.list(params),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<ProgrammeListResult>>(
          API_ENDPOINTS.admin.programmes,
          { params },
        )
      ).data.data,
  });
}
export function useProgramme(id: string) {
  return useQuery({
    queryKey: queryKeys.programmes.detail(id),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<ProgrammeDetail>>(
          API_ENDPOINTS.admin.programme(id),
        )
      ).data.data,
    enabled: Boolean(id),
  });
}
export function useCreateProgramme() {
  const c = useQueryClient();
  return useMutation({
    mutationFn: async (v: CreateProgrammeRequest) =>
      (
        await apiClient.post<ApiSuccess<ProgrammeDetail>>(
          API_ENDPOINTS.admin.programmes,
          v,
        )
      ).data.data,
    onSuccess: () =>
      c.invalidateQueries({ queryKey: queryKeys.programmes.all }),
  });
}
export function useUpdateProgramme(id: string) {
  const c = useQueryClient();
  return useMutation({
    mutationFn: async (v: UpdateProgrammeRequest) =>
      (
        await apiClient.patch<ApiSuccess<ProgrammeDetail>>(
          API_ENDPOINTS.admin.programme(id),
          v,
        )
      ).data.data,
    onSuccess: (p) => {
      c.setQueryData(queryKeys.programmes.detail(id), p);
      c.invalidateQueries({ queryKey: queryKeys.programmes.lists() });
    },
  });
}


export async function uploadProgrammeCover(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/programmes/cover-image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.message ?? "The cover image could not be uploaded.");
  return body.data.url as string;
}

export function useDeleteProgramme() {
  const c = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<ApiSuccess<{ id: string }>>(API_ENDPOINTS.admin.programme(id))).data.data,
    onSuccess: (_result, id) => {
      c.removeQueries({ queryKey: queryKeys.programmes.detail(id) });
      c.invalidateQueries({ queryKey: queryKeys.programmes.lists() });
    },
  });
}
