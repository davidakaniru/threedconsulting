"use client";

import { useMutation } from "@tanstack/react-query";
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
  return useMutation({ mutationFn: login });
}
