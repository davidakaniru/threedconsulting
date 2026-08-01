"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/auth/use-register";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/schemas/register-schema";

const defaultValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

export function RegisterForm() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      const result = await registerMutation.mutateAsync(values);

      if (result.requiresEmailConfirmation) {
        setRegisteredEmail(values.email);
        return;
      }

      router.replace("/portal/parent");
      router.refresh();
    } catch {
      // The mutation exposes the mapped API error in the alert above.
    }
  }

  if (registeredEmail) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-turquoise/15 text-turquoise">
          <Mail aria-hidden="true" className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">
          Check your email
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          We sent a confirmation link to <strong>{registeredEmail}</strong>.
          Open it to activate your parent account.
        </p>
        <div className="mt-6 rounded-2xl bg-primary/5 px-4 py-3 text-left text-sm text-muted-foreground">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>
              The link may take a minute to arrive. Check your spam folder too.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="mt-7 w-full">
          <Link href="/sign-in">Return to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
          Parent account
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Register to manage enrolments and follow your child&apos;s learning
          journey.
        </p>
      </div>

      {registerMutation.error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{registerMutation.error.message}</p>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="first-name"
            label="First name"
            autoComplete="given-name"
            required
            errorMessage={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="last-name"
            label="Last name"
            autoComplete="family-name"
            required
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
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
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          info="At least 8 characters, with uppercase, lowercase and a number."
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirm-password"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          required
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div>
          <label
            htmlFor="accepted-terms"
            className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground"
          >
            <input
              id="accepted-terms"
              type="checkbox"
              className="mt-1 size-4 rounded border-primary/20 accent-primary"
              {...register("acceptedTerms")}
            />
            <span>I agree to the terms of service and privacy policy.</span>
          </label>
          {errors.acceptedTerms?.message && (
            <p
              role="alert"
              className="mt-2 text-xs font-medium text-destructive"
            >
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={registerMutation.isPending}
          className="w-full"
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
          {!registerMutation.isPending && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
