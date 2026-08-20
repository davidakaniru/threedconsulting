"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiSuccess } from "@/lib/api/types";
import type { LoginRequest } from "@/lib/schemas/login-schema";
import type { LoginResponse } from "@/types/auth";

async function login(values: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiSuccess<LoginResponse>>(
    API_ENDPOINTS.auth.login,
    values,
  );
  return data.data;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // A successful login establishes a new authenticated session.
      // Discard everything from the previous session so no user-scoped
      // data can be reused after switching accounts.
      queryClient.clear();
    },
  });
}
