"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/query-keys";
import type { ApiSuccess } from "@/lib/api/types";
import type {
  CreateStudentRequest,
  UpdateStudentPersonalRequest,
  UpdateStudentRequest,
} from "@/modules/students/schemas";
import type {
  StudentDetail,
  StudentListResult,
} from "@/modules/students/types";

export type StudentListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};
export function useStudents(params: StudentListParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<StudentListResult>>(
          API_ENDPOINTS.admin.students,
          { params },
        )
      ).data.data,
  });
}
export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: async () =>
      (
        await apiClient.get<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.admin.student(id),
        )
      ).data.data,
    enabled: Boolean(id),
  });
}
export function useCreateStudent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateStudentRequest) =>
      (
        await apiClient.post<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.admin.students,
          values,
        )
      ).data.data,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: queryKeys.students.all }),
  });
}
export function useUpdateStudent(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateStudentRequest) =>
      (
        await apiClient.patch<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.admin.student(id),
          values,
        )
      ).data.data,
    onSuccess: (student) => {
      client.setQueryData(queryKeys.students.detail(id), student);
      client.invalidateQueries({ queryKey: queryKeys.students.lists() });
    },
  });
}
export function useUploadStudentPhoto(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("photo", file);
      return (
        await apiClient.post<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.admin.studentPhoto(id),
          form,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
      ).data.data;
    },
    onSuccess: (student) => {
      client.setQueryData(queryKeys.students.detail(id), student);
      client.invalidateQueries({ queryKey: queryKeys.students.lists() });
    },
  });
}


export function useUpdateParentStudent(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values: UpdateStudentPersonalRequest) =>
      (
        await apiClient.patch<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.parent.student(id),
          values,
        )
      ).data.data,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
    },
  });
}

export function useUploadParentStudentPhoto(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("photo", file);
      return (
        await apiClient.post<ApiSuccess<StudentDetail>>(
          API_ENDPOINTS.parent.studentPhoto(id),
          form,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
      ).data.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
    },
  });
}
