"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiSuccess } from "@/lib/api/types";
import type { RegisterRequest } from "@/lib/schemas/register-schema";

export interface RegisterResponse {
  message: string;
  requiresEmailConfirmation: boolean;
}

async function register(values: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<ApiSuccess<RegisterResponse>>(API_ENDPOINTS.auth.register, values);
  return data.data;
}

export function useRegister() {
  return useMutation({ mutationFn: register });
}
