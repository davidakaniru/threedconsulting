"use client";

import Link from "next/link";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas/forgot-password-schema";

const defaultValues: ForgotPasswordFormValues = {
  email: "",
};

export function ForgotPasswordForm({ recoveryError }: { recoveryError?: string }) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error?.message ??
            data?.message ??
            "We couldn't process your request. Please try again.",
        );
      }

      setSubmittedEmail(values.email);
      reset(defaultValues);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn't process your request. Please try again.",
      );
    }
  }

  if (submittedEmail) {
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
          Check your inbox
        </p>

        <h1
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight text-foreground sm:text-4xl"
        >
          Reset instructions sent
        </h1>

        <p
          className="mx-auto mt-4 max-w-md leading-7
            text-muted-foreground"
        >
          If an account exists for{" "}
          <span className="font-semibold text-foreground">
            {submittedEmail}
          </span>
          , we’ve sent an email with instructions to reset the password.
        </p>

        <p
          className="mt-3 text-sm leading-6
            text-muted-foreground"
        >
          The email may take a few minutes to arrive. Check your spam or junk
          folder as well.
        </p>

        <Button asChild size="lg" className="mt-7 w-full">
          <Link href="/sign-in">
            Return to sign in
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>

        <button
          type="button"
          onClick={() => {
            setSubmittedEmail(null);
            setServerError(null);
          }}
          className="mt-5 text-sm font-semibold text-primary
            transition-colors hover:text-primary/80
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Try another email address
        </button>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm
          font-semibold text-muted-foreground transition-colors
          hover:text-primary focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
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
          <Mail aria-hidden="true" className="size-6" />
        </span>

        <p
          className="mt-5 font-display text-sm font-bold
            uppercase tracking-wider text-primary"
        >
          Forgot your password?
        </p>

        <h1
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight text-foreground sm:text-4xl"
        >
          Let’s get you back in
        </h1>

        <p
          className="mt-3 leading-7
            text-muted-foreground"
        >
          Enter the email address associated with your account and we’ll send
          you a secure password-reset link.
        </p>
      </div>

      {recoveryError === "invalid_or_expired_link" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            That password-reset link is invalid or has expired. Enter your email
            address below to request a new one.
          </p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl
            border border-destructive/20 bg-destructive/5
            px-4 py-3 text-sm text-destructive"
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
          id="forgot-password-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          errorMessage={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending instructions..." : "Send reset instructions"}

          {!isSubmitting && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>
      </form>

      <p
        className="mt-7 text-center text-sm
          text-muted-foreground"
      >
        Remembered your password?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary
            transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
