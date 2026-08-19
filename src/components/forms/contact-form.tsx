"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { enquiryOptions } from "@/data/contact";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact-schema";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "",
  message: "",
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitted(false);
    setSubmitError(null);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error?.message ||
            "We couldn't send your message right now. Please try again.",
        );
      }

      reset(defaultValues);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't send your message right now. Please try again.",
      );
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2.5rem] bg-white p-6
        shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)]
        sm:p-8 lg:p-10"
    >
      <div>
        <p
          className="font-display text-sm font-bold uppercase
            tracking-wider text-primary"
        >
          Send us a message
        </p>

        <h2
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight text-foreground sm:text-4xl"
        >
          How can we help?
        </h2>

        <p
          className="mt-3 max-w-xl leading-7
            text-muted-foreground"
        >
          Tell us what you’re looking for and a member of our friendly team will
          get back to you.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Input
          id="name"
          label="Name"
          placeholder="Enter your full name"
          required
          errorMessage={errors.name?.message}
          {...register("name")}
        />

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

        <div className="sm:col-span-2">
          <Input
            id="phone"
            type="tel"
            label="Phone number"
            placeholder="e.g. +234 800 000 0000"
            autoComplete="tel"
            inputMode="tel"
            required
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="enquiryType"
            control={control}
            render={({ field, fieldState }) => (
              <SelectField
                id="enquiry-type"
                name={field.name}
                label="Enquiry option"
                placeholder="Choose an enquiry option"
                options={enquiryOptions}
                value={field.value}
                onValueChange={field.onChange}
                required
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Textarea
            id="message"
            label="Message"
            placeholder="Tell us how we can help..."
            rows={6}
            required
            className="resize-none"
            errorMessage={errors.message?.message}
            {...register("message")}
          />
        </div>
      </div>

      <div
        className="mt-7 flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between"
      >
        <p
          className="max-w-md text-xs leading-5
            text-muted-foreground"
        >
          By submitting this form, you agree that we may contact you regarding
          your enquiry.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="sm:min-w-44"
        >
          {isSubmitting ? "Sending..." : "Send message"}

          {!isSubmitting && <Send aria-hidden="true" className="size-4" />}
        </Button>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      {submitted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl
            bg-turquoise/10 px-4 py-3 text-sm font-semibold
            text-teal-800"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

          <p>
            Thank you! Your message has been sent. Our team will be in touch
            soon.
          </p>
        </div>
      )}
    </form>
  );
}
