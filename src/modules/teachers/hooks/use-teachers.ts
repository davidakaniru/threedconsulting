"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from "@/modules/teachers/schemas";
import type {
  TeacherAction,
  TeacherDetail,
  TeacherListResult,
} from "@/modules/teachers/types";

export type TeacherListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};

export function useTeachers(params: TeacherListParams) {
  return useQuery({
    queryKey: queryKeys.teachers.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<TeacherListResult>>(
        API_ENDPOINTS.admin.teachers,
        { params },
      );
      return data.data;
    },
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccess<TeacherDetail>>(
        API_ENDPOINTS.admin.teacher(id),
      );
      return data.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateTeacherRequest) => {
      const { data } = await apiClient.post<
        ApiSuccess<{ id: string; email: string }>
      >(API_ENDPOINTS.admin.teachers, values);
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all }),
  });
}


export function useDeleteTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete<
        ApiSuccess<{ id: string; email: string; employeeId: string }>
      >(API_ENDPOINTS.admin.teacher(id));
      return data.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.teachers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.lists() });
    },
  });
}

export function useUpdateTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateTeacherRequest) => {
      const { data } = await apiClient.patch<ApiSuccess<TeacherDetail>>(
        API_ENDPOINTS.admin.teacher(id),
        values,
      );
      return data.data;
    },
    onSuccess: (teacher) => {
      queryClient.setQueryData(queryKeys.teachers.detail(id), teacher);
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.lists() });
    },
  });
}

export function useTeacherAction(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (action: TeacherAction) => {
      const { data } = await apiClient.post<ApiSuccess<TeacherDetail>>(
        API_ENDPOINTS.admin.teacherActions(id),
        action,
      );
      return data.data;
    },
    onSuccess: (teacher) => {
      queryClient.setQueryData(queryKeys.teachers.detail(id), teacher);
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.lists() });
    },
  });
}
