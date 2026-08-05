"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type { AttendanceUpdateRequest, SessionAttendanceSheet } from "../types";

export function useSessionAttendance(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.attendance.detail(sessionId),
    queryFn: async () => (await apiClient.get<ApiSuccess<SessionAttendanceSheet>>(API_ENDPOINTS.teacher.sessionAttendance(sessionId))).data.data,
    enabled: Boolean(sessionId),
  });
}

export function useSaveAttendance(sessionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: AttendanceUpdateRequest) => (await apiClient.patch<ApiSuccess<SessionAttendanceSheet>>(API_ENDPOINTS.teacher.sessionAttendance(sessionId), input)).data.data,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.attendance.all }),
        client.invalidateQueries({ queryKey: queryKeys.sessions.detail(sessionId) }),
        client.invalidateQueries({ queryKey: queryKeys.sessions.all }),
      ]);
    },
  });
}
