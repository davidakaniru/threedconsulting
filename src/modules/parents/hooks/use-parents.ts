"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  CreateParentRequest,
  UpdateParentRequest,
} from "@/modules/parents/schemas";
import type {
  ParentAction,
  ParentDetail,
  ParentListResult,
} from "@/modules/parents/types";
export const useParents = (params: any) =>
  useQuery({
    queryKey: queryKeys.parents.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<ParentListResult>>(
        API_ENDPOINTS.admin.parents,
        { params },
      );
      return data.data;
    },
  });
export const useParent = (id: string) =>
  useQuery({
    queryKey: queryKeys.parents.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<ParentDetail>>(
        API_ENDPOINTS.admin.parent(id),
      );
      return data.data;
    },
    enabled: !!id,
  });
export function useCreateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: CreateParentRequest) => {
      const { data } = await apiClient.post<
        ApiSuccess<{ id: string; email: string }>
      >(API_ENDPOINTS.admin.parents, v);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.parents.all }),
  });
}
export function useUpdateParent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: UpdateParentRequest) => {
      const { data } = await apiClient.patch<ApiSuccess<ParentDetail>>(
        API_ENDPOINTS.admin.parent(id),
        v,
      );
      return data.data;
    },
    onSuccess: (p) => {
      qc.setQueryData(queryKeys.parents.detail(id), p);
      qc.invalidateQueries({ queryKey: queryKeys.parents.lists() });
    },
  });
}
export function useParentAction(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: ParentAction) => {
      const { data } = await apiClient.post<ApiSuccess<ParentDetail>>(
        API_ENDPOINTS.admin.parentActions(id),
        v,
      );
      return data.data;
    },
    onSuccess: (p) => {
      qc.setQueryData(queryKeys.parents.detail(id), p);
      qc.invalidateQueries({ queryKey: queryKeys.parents.lists() });
    },
  });
}
