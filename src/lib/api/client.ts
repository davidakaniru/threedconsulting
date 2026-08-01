import axios from "axios";
import { toApiError } from "@/lib/api/errors";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  config.headers.set("x-request-id", crypto.randomUUID());
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
