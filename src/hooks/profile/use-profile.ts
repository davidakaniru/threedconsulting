"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiSuccess } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";
import type {
  PasswordChangeRequest,
  ProfileUpdateRequest,
} from "@/lib/schemas/profile-schema";
import type { AuthenticatedUser } from "@/types/auth";

async function getProfile() {
  const { data } = await apiClient.get<ApiSuccess<AuthenticatedUser>>(
    API_ENDPOINTS.profile.root,
  );
  return data.data;
}

async function updateProfile(values: ProfileUpdateRequest) {
  const { data } = await apiClient.patch<ApiSuccess<AuthenticatedUser>>(
    API_ENDPOINTS.profile.root,
    values,
  );
  return data.data;
}

async function uploadAvatar(file: File) {
  const body = new FormData();
  body.append("avatar", file);

  const { data } = await apiClient.post<ApiSuccess<AuthenticatedUser>>(
    API_ENDPOINTS.profile.avatar,
    body,
    { headers: { "Content-Type": undefined } },
  );

  return data.data;
}

async function changePassword(values: PasswordChangeRequest) {
  await apiClient.patch(API_ENDPOINTS.profile.password, values);
}

async function deactivateProfile() {
  await apiClient.delete(API_ENDPOINTS.profile.root);
}

export function useProfile(initialData?: AuthenticatedUser) {
  return useQuery({
    queryKey: queryKeys.profile.detail(),
    queryFn: getProfile,
    initialData,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile.detail(), profile);
      queryClient.setQueryData(queryKeys.auth.currentUser(), profile);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile.detail(), profile);
      queryClient.setQueryData(queryKeys.auth.currentUser(), profile);
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}

export function useDeactivateProfile() {
  return useMutation({ mutationFn: deactivateProfile });
}
