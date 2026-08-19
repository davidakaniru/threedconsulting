"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  TutorApplicationAction,
  TutorApplicationDetail,
  TutorApplicationListResult,
} from "@/modules/tutor-applications/types";

export const tutorApplicationQueryKeys = {
  all: ["tutor-applications"] as const,
  list: (params: Record<string, unknown>) =>
    ["tutor-applications", "list", params] as const,
  detail: (id: string) => ["tutor-applications", "detail", id] as const,
};

export function useTutorApplications(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: tutorApplicationQueryKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiSuccess<TutorApplicationListResult>
      >(API_ENDPOINTS.admin.tutorApplications, { params });
      return data.data;
    },
  });
}

export function useTutorApplication(id: string) {
  return useQuery({
    queryKey: tutorApplicationQueryKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<TutorApplicationDetail>>(
        API_ENDPOINTS.admin.tutorApplication(id),
      );
      return data.data;
    },
    enabled: Boolean(id),
  });
}

export function useTutorApplicationAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: TutorApplicationAction;
    }) => {
      const { data } = await apiClient.post<ApiSuccess<unknown>>(
        API_ENDPOINTS.admin.tutorApplicationActions(id),
        action,
      );
      return data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: tutorApplicationQueryKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({
        queryKey: tutorApplicationQueryKeys.detail(variables.id),
      });
    },
  });
}
