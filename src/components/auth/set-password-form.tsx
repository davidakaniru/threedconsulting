"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toApiError } from "@/lib/api/errors";
import {
  setInvitedPasswordSchema,
  type SetInvitedPasswordRequest,
} from "@/modules/teachers/schemas";

export function SetPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetInvitedPasswordRequest>({
    resolver: yupResolver(setInvitedPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });
  const submit = handleSubmit(async (values) => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.setPassword, values);
      toast.success("Account activated. Welcome to 3D Consulting.");
      router.replace("/portal/teacher");
      router.refresh();
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  return (
    <div>
      <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <KeyRound className="size-6" />
      </span>
      <p className="mt-5 text-sm font-bold uppercase tracking-wider text-primary">
        Tutor account setup
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">
        Create your password
      </h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        Choose a private password to finish activating your tutor account.
      </p>
      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Input
          id="password"
          type="password"
          label="Password"
          required
          autoComplete="new-password"
          info="At least 8 characters with uppercase, lowercase and a number."
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          required
          autoComplete="new-password"
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? (
            "Activating account..."
          ) : (
            <>
              Activate account
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
