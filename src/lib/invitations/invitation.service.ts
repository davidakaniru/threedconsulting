import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
export async function inviteUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  role: "teacher" | "parent";
  origin: string;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(
    input.email,
    {
      redirectTo: `${input.origin}/auth/confirm?next=/set-password`,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role,
      },
    },
  );
  if (error || !data.user) {
    if (error?.message.toLowerCase().includes("already"))
      throw new ApiError(
        "EMAIL_EXISTS",
        "An account already exists with that email address.",
        409,
      );
    throw new ApiError(
      "INVITATION_FAILED",
      "The invitation could not be sent.",
      500,
    );
  }
  return data.user;
}
export async function resendInvitation(email: string, origin: string) {
  const admin = createAdminClient();
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/set-password`,
  });
  if (error)
    throw new ApiError(
      "INVITATION_RESEND_FAILED",
      "The activation email could not be resent.",
      500,
    );
}
