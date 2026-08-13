import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import * as yup from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { setContactInquiryStatus } from "@/modules/contact-inquiries/server";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

const schema = yup
  .object({
    status: yup
      .string()
      .oneOf(["unread", "read", "archived"])
      .required(),
  })
  .required();

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const input = await schema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });
    return apiSuccess(await setContactInquiryStatus(id, input.status));
  } catch (error) {
    if (error instanceof ValidationError)
      return apiError("VALIDATION_ERROR", "Invalid enquiry status.", 422);
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "The enquiry could not be updated.",
      500,
    );
  }
}
