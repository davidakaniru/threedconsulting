"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/login-schema";
import { useLogin } from "@/hooks/auth/use-login";
import { getRoleRedirect } from "@/lib/utils";

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync(values);
      router.replace(getRoleRedirect(result.user.role));
      router.refresh();
    } catch {
      // The mutation error is rendered above the form.
    }
  }

  return (
    <div>
      <div>
        <p
          className="font-display text-sm font-bold uppercase
            tracking-wider text-primary"
        >
          Welcome back
        </p>

        <h1
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight text-foreground sm:text-4xl"
        >
          Sign in to your account
        </h1>

        <p
          className="mt-3 leading-7
            text-muted-foreground"
        >
          Enter your details to continue to your dashboard.
        </p>
      </div>

      {reason === "account-deactivated" && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-turquoise/20 bg-turquoise/5 px-4 py-3 text-sm text-foreground"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-teal-700"
          />
          <p>Your account has been deactivated and you have been signed out.</p>
        </div>
      )}

      {reason === "account-unavailable" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            This account is currently unavailable. Please contact an
            administrator if you need access restored.
          </p>
        </div>
      )}

      {loginMutation.error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3
            rounded-2xl border border-destructive/20
            bg-destructive/5 px-4 py-3
            text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

          <p>{loginMutation.error.message}</p>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-5"
      >
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          errorMessage={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div
            className="mb-2 flex items-center
              justify-between gap-4"
          >
            <label
              htmlFor="password"
              className="font-display text-sm
                font-bold text-foreground"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary
                transition-colors hover:text-primary/80
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            errorMessage={errors.password?.message}
            {...register("password")}
          />
        </div>

        <label
          htmlFor="remember-me"
          className="flex w-fit cursor-pointer
            items-center gap-3 text-sm
            text-muted-foreground"
        >
          <input
            id="remember-me"
            type="checkbox"
            className="size-4 rounded border-primary/20
              accent-primary"
            {...register("rememberMe")}
          />

          <span>Keep me signed in on this device</span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loginMutation.isPending}
          className="w-full"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}

          {!loginMutation.isPending && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>
      </form>

      <p
        className="mt-7 text-center text-sm
          text-muted-foreground"
      >
        New to the platform?{" "}
        <Link
          href="/enrolment"
          className="font-semibold text-primary
            hover:text-primary/80"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
