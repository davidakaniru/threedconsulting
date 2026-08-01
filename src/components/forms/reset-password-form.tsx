"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas/reset-password-schema";

const defaultValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

type ResetPasswordErrorResponse = {
  message?: string;
  code?: string;
};

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccessful, setIsSuccessful] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setServerError("This password-reset link is incomplete.");
      return;
    }

    setServerError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data: ResetPasswordErrorResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          getResetPasswordErrorMessage(data?.code, data?.message),
        );
      }

      setIsSuccessful(true);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn't reset your password. Please try again.",
      );
    }
  }

  if (!token) {
    return <InvalidResetLink />;
  }

  if (isSuccessful) {
    return <ResetPasswordSuccess />;
  }

  return (
    <div>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm
          font-semibold text-muted-foreground
          transition-colors hover:text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to sign in
      </Link>

      <div className="mt-7">
        <span
          className="grid size-12 place-items-center
            rounded-2xl bg-primary/10 text-primary"
        >
          <KeyRound aria-hidden="true" className="size-6" />
        </span>

        <p
          className="mt-5 font-display text-sm font-bold
            uppercase tracking-wider text-primary"
        >
          Create a new password
        </p>

        <h1
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight text-foreground sm:text-4xl"
        >
          Reset your password
        </h1>

        <p
          className="mt-3 leading-7
            text-muted-foreground"
        >
          Choose a strong password that you haven’t used for this account
          before.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3
            rounded-2xl border border-destructive/20
            bg-destructive/5 px-4 py-3
            text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

          <p>{serverError}</p>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-5"
      >
        <Input
          id="new-password"
          type="password"
          label="New password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          required
          info="Use at least 8 characters, including uppercase, lowercase and a number."
          errorMessage={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirm-password"
          type="password"
          label="Confirm new password"
          placeholder="Enter your new password again"
          autoComplete="new-password"
          required
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Resetting password..." : "Reset password"}

          {!isSubmitting && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

function InvalidResetLink() {
  return (
    <div className="text-center">
      <span
        className="mx-auto grid size-16 place-items-center
          rounded-full bg-coral/10 text-coral"
      >
        <AlertCircle aria-hidden="true" className="size-8" />
      </span>

      <p
        className="mt-5 font-display text-sm font-bold
          uppercase tracking-wider text-coral"
      >
        Invalid reset link
      </p>

      <h1
        className="mt-2 font-display text-3xl font-extrabold
          leading-tight text-foreground sm:text-4xl"
      >
        This link can’t be used
      </h1>

      <p
        className="mx-auto mt-4 max-w-md leading-7
          text-muted-foreground"
      >
        The password-reset link is missing or incomplete. Request a new link to
        continue.
      </p>

      <Button asChild size="lg" className="mt-7 w-full">
        <Link href="/forgot-password">
          Request a new link
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Button>

      <Link
        href="/sign-in"
        className="mt-5 inline-flex items-center gap-2
          text-sm font-semibold text-primary
          transition-colors hover:text-primary/80"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Return to sign in
      </Link>
    </div>
  );
}

function ResetPasswordSuccess() {
  return (
    <div className="text-center">
      <span
        className="mx-auto grid size-16 place-items-center
          rounded-full bg-turquoise/15 text-teal-700"
      >
        <CheckCircle2 aria-hidden="true" className="size-8" />
      </span>

      <p
        className="mt-5 font-display text-sm font-bold
          uppercase tracking-wider text-primary"
      >
        Password updated
      </p>

      <h1
        className="mt-2 font-display text-3xl font-extrabold
          leading-tight text-foreground sm:text-4xl"
      >
        You’re ready to sign in
      </h1>

      <p
        className="mx-auto mt-4 max-w-md leading-7
          text-muted-foreground"
      >
        Your password has been changed successfully. You can now sign in using
        your new password.
      </p>

      <Button asChild size="lg" className="mt-7 w-full">
        <Link href="/sign-in">
          Continue to sign in
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function getResetPasswordErrorMessage(code?: string, fallbackMessage?: string) {
  switch (code) {
    case "RESET_TOKEN_EXPIRED":
      return "This password-reset link has expired. Please request a new one.";

    case "RESET_TOKEN_INVALID":
      return "This password-reset link is invalid. Please request a new one.";

    case "RESET_TOKEN_USED":
      return "This password-reset link has already been used. Please request a new one.";

    case "PASSWORD_REUSED":
      return "Please choose a password you haven’t used before.";

    default:
      return (
        fallbackMessage ?? "We couldn't reset your password. Please try again."
      );
  }
}
