import { NextResponse } from "next/server";
import type {
  ApiErrorDetails,
  ApiErrorResponse,
  ApiSuccess,
} from "@/lib/api/types";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: ApiErrorDetails,
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status },
  );
}
