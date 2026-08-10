import axios from "axios";
import type { ApiErrorResponse } from "@/lib/api/types";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const body = error.response?.data;
    return new ApiError(
      body?.success === false ? body.error.code : "REQUEST_FAILED",
      body?.success === false
        ? body.error.message
        : "The request could not be completed.",
      error.response?.status ?? 500,
      body?.success === false ? body.error.details : undefined,
    );
  }

  if (error instanceof Error) {
    return new ApiError("REQUEST_FAILED", error.message, 500);
  }

  return new ApiError(
    "REQUEST_FAILED",
    "The request could not be completed.",
    500,
  );
}
