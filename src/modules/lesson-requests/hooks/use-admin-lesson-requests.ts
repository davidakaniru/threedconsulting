"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type { EligibleTutor, LessonRequestDetail, LessonRequestListResult } from "../types";

export function useLessonRequests(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.lessonRequests.list(filters ?? {}),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<LessonRequestListResult>>(
          API_ENDPOINTS.admin.lessonRequests,
          { params: filters },
        )
      ).data.data,
  });
}

export function useLessonRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.lessonRequests.detail(id),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<LessonRequestDetail>>(
          API_ENDPOINTS.admin.lessonRequest(id),
        )
      ).data.data,
    enabled: Boolean(id),
  });
}

export function usePublishLessonRequest(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (
        await apiClient.post<ApiSuccess<{ id: string; status: string }>>(
          API_ENDPOINTS.admin.lessonRequestPublish(id),
        )
      ).data.data,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.lessonRequests.all }),
        client.invalidateQueries({ queryKey: queryKeys.lessonRequests.detail(id) }),
        client.invalidateQueries({ queryKey: queryKeys.teachingAssignments.all }),
      ]);
    },
  });
}

export function useEligibleTutors(id: string) {
  return useQuery({
    queryKey: [...queryKeys.lessonRequests.detail(id), "eligible-tutors"],
    queryFn: async () => (await apiClient.get<ApiSuccess<EligibleTutor[]>>(`/admin/lesson-requests/${id}/eligible-tutors`)).data.data,
    enabled: Boolean(id),
  });
}

export function useAssignLessonRequest(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (teacherId: string) => (await apiClient.post<ApiSuccess<{ id: string; status: string }>>(`/admin/lesson-requests/${id}/assign`, { teacherId })).data.data,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: queryKeys.lessonRequests.all });
      await client.invalidateQueries({ queryKey: queryKeys.lessonRequests.detail(id) });
      await client.invalidateQueries({ queryKey: queryKeys.teachingAssignments.all });
      await client.invalidateQueries({ queryKey: queryKeys.teachers.all });
    },
  });
}
