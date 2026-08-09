"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type { HomeworkRequest } from "../schemas";
import type { Homework, HomeworkListResult } from "../types";
export function useTeacherHomework(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.homework.list(filters ?? {}),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<HomeworkListResult>>(
          API_ENDPOINTS.teacher.homework,
          { params: filters },
        )
      ).data.data,
  });
}
export function useTeacherHomeworkItem(id: string) {
  return useQuery({
    queryKey: queryKeys.homework.detail(id),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<Homework>>(
          API_ENDPOINTS.teacher.homeworkItem(id),
        )
      ).data.data,
    enabled: !!id,
  });
}
export function useCreateHomework() {
  const c = useQueryClient();
  return useMutation({
    mutationFn: async (v: HomeworkRequest) =>
      (
        await apiClient.post<ApiSuccess<Homework>>(
          API_ENDPOINTS.teacher.homework,
          v,
        )
      ).data.data,
    onSuccess: () =>
      Promise.all([
        c.invalidateQueries({ queryKey: queryKeys.homework.all }),
        c.invalidateQueries({ queryKey: queryKeys.sessions.all }),
      ]),
  });
}
export function useUpdateHomework(id: string) {
  const c = useQueryClient();
  return useMutation({
    mutationFn: async (v: HomeworkRequest) =>
      (
        await apiClient.patch<ApiSuccess<Homework>>(
          API_ENDPOINTS.teacher.homeworkItem(id),
          v,
        )
      ).data.data,
    onSuccess: () =>
      Promise.all([
        c.invalidateQueries({ queryKey: queryKeys.homework.all }),
        c.invalidateQueries({ queryKey: queryKeys.sessions.all }),
      ]),
  });
}
