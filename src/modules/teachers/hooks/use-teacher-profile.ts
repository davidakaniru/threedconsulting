"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiSuccess } from "@/lib/api/types";
import type { TeacherDetail } from "@/modules/teachers/types";
import type { TeacherProfileRequest } from "@/modules/teachers/schemas";
import { queryKeys } from "@/lib/query/query-keys";

export function useTeacherProfile() {
  return useQuery({
    queryKey: queryKeys.teacherProfile.all,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<TeacherDetail>>(API_ENDPOINTS.teacher.profile);
      return data.data;
    },
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TeacherProfileRequest) => {
      const { data } = await apiClient.patch<ApiSuccess<TeacherDetail>>(API_ENDPOINTS.teacher.profile, values);
      return data.data;
    },
    onSuccess: (teacher) => {
      queryClient.setQueryData(queryKeys.teacherProfile.all, teacher);
      queryClient.invalidateQueries({ queryKey: queryKeys.teacherProfile.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
    },
  });
}

export function useUploadTeacherCv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("cv", file);
      const { data } = await apiClient.post<ApiSuccess<TeacherDetail>>(API_ENDPOINTS.teacher.profileCv, body, { headers: { "Content-Type": undefined } });
      return data.data;
    },
    onSuccess: (teacher) => {
      queryClient.setQueryData(queryKeys.teacherProfile.all, teacher);
      queryClient.invalidateQueries({ queryKey: queryKeys.teacherProfile.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
    },
  });
}
