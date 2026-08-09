"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  CreateTeachingAssignmentRequest,
  UpdateTeachingAssignmentRequest,
} from "@/modules/teaching-assignments/schemas";
import type {
  TeachingAssignment,
  TeachingAssignmentListResult,
} from "@/modules/teaching-assignments/types";

export function useTeachingAssignments(filters?: {
  programmeId?: string;
  teacherId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: queryKeys.teachingAssignments.list(filters ?? {}),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<TeachingAssignmentListResult>>(
          API_ENDPOINTS.admin.teachingAssignments,
          { params: filters },
        )
      ).data.data,
  });
}
export function useCreateTeachingAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateTeachingAssignmentRequest) =>
      (
        await apiClient.post<ApiSuccess<TeachingAssignment>>(
          API_ENDPOINTS.admin.teachingAssignments,
          values,
        )
      ).data.data,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.teachingAssignments.all }),
  });
}
export function useUpdateTeachingAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: UpdateTeachingAssignmentRequest;
    }) =>
      (
        await apiClient.patch<ApiSuccess<TeachingAssignment>>(
          API_ENDPOINTS.admin.teachingAssignment(id),
          values,
        )
      ).data.data,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.teachingAssignments.all }),
  });
}
export function useRemoveTeachingAssignment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiClient.delete<ApiSuccess<{ id: string }>>(
          API_ENDPOINTS.admin.teachingAssignment(id),
        )
      ).data.data,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.teachingAssignments.all }),
  });
}
