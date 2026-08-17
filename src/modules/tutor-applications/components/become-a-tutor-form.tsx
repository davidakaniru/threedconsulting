"use client";

import { useMemo, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Controller, useForm, type FieldPath } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/forms/select-field";
import {
  tutorApplicationSchema,
  type TutorApplicationValues,
} from "@/modules/tutor-applications/schemas";

type FormValues = TutorApplicationValues & {
  profileImage?: FileList;
  cv?: FileList;
};

const steps = [
  {
    title: "Personal information",
    description: "Tell us how we can contact you and where you are based.",
  },
  {
    title: "About you",
    description: "Help us get to know you beyond your professional experience.",
  },
  {
    title: "Professional information",
    description: "Tell us about your expertise, qualifications and experience.",
  },
] as const;

const stepFields: Array<Array<FieldPath<FormValues>>> = [
  [
    "firstName",
    "lastName",
    "email",
    "phone",
    "addressLine1",
    "city",
    "country",
  ],
  ["gender", "dateOfBirth", "summary", "profileImage"],
  ["expertise", "qualifications", "cv"],
];

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const tutorApplicationFormSchema = tutorApplicationSchema.shape({
  profileImage: yup
    .mixed<FileList>()
    .test("required", "Please upload a profile image.", (value) =>
      Boolean(value?.length),
    )
    .test(
      "size",
      "Profile image must be 5 MB or smaller.",
      (value) => !value?.[0] || value[0].size <= 5 * 1024 * 1024,
    ),
  cv: yup
    .mixed<FileList>()
    .test(
      "size",
      "CV must be 10 MB or smaller.",
      (value) => !value?.[0] || value[0].size <= 10 * 1024 * 1024,
    ),
});

const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  city: "",
  country: "",
  gender: "female",
  dateOfBirth: "",
  summary: "",
  expertise: "",
  qualifications: "",
  profileImage: undefined,
  cv: undefined,
};

export function BecomeATutorForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const {
    register,
    trigger,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(tutorApplicationFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isLastStep = step === steps.length - 1;

  async function nextStep() {
    const valid = await trigger(stepFields[step], {
      shouldFocus: true,
    });

    if (!valid) return;

    if (isLastStep) {
      handleSubmit(onSubmit)();
      return;
    }

    if (step === 1 && !profileImageFile) {
      setError("profileImage", {
        type: "required",
        message: "Please upload a profile image.",
      });
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 10, behavior: "smooth" });
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 10, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    if (step !== steps.length - 1) {
      return;
    }

    setSubmitted(false);
    setSubmitError(null);

    const profileImage = profileImageFile;
    const cv = cvFile;

    if (!profileImage) {
      setStep(1);
      setError("profileImage", {
        type: "required",
        message: "Please upload a profile image.",
      });
      return;
    }

    if (profileImage.size > 5 * 1024 * 1024) {
      setStep(1);
      setError("profileImage", {
        type: "validate",
        message: "Profile image must be 5 MB or smaller.",
      });
      return;
    }

    if (cv && cv.size > 10 * 1024 * 1024) {
      setError("cv", {
        type: "validate",
        message: "CV must be 10 MB or smaller.",
      });
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "profileImage" || key === "cv") return;
      formData.append(key, String(value ?? ""));
    });

    formData.append("profileImage", profileImage);
    if (cv) formData.append("cv", cv);

    try {
      const response = await fetch("/api/public/tutor-applications", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error?.message ||
            "We could not submit your application. Please try again.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your application. Please try again.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2.5rem] bg-white p-8 text-center shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)] sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-turquoise/10 text-teal-700">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-3xl font-extrabold text-foreground">
          Application received
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
          Thank you for your interest in becoming a Three-dmanagers tutor. Our
          team will review your application and contact you using the details
          you provided.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2.5rem] bg-white p-6 shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)] sm:p-8 lg:p-10"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          {steps.map((item, index) => (
            <div key={item.title} className="flex flex-1 items-center gap-2">
              <span
                className={[
                  "grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                  index <= step
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {index + 1}
              </span>
              <span
                className={[
                  "hidden text-sm font-bold sm:block",
                  index === step ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {item.title}
              </span>
              {index < steps.length - 1 && (
                <span
                  className="mx-1 h-px flex-1 bg-border"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-7">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
            Step {step + 1} of {steps.length}
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">
            {steps[step].title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {steps[step].description}
          </p>
        </div>
      </div>

      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="firstName"
            label="First name"
            required
            autoComplete="given-name"
            errorMessage={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="lastName"
            label="Last name"
            required
            autoComplete="family-name"
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            id="email"
            type="email"
            label="Email address"
            required
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="phone"
            type="tel"
            label="Phone number"
            required
            autoComplete="tel"
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="addressLine1"
            label="Address"
            required
            autoComplete="street-address"
            errorMessage={errors.addressLine1?.message}
            {...register("addressLine1")}
          />
          <Input
            id="city"
            label="City / town"
            required
            autoComplete="address-level2"
            errorMessage={errors.city?.message}
            {...register("city")}
          />
          <Input
            id="country"
            label="Country"
            required
            autoComplete="country-name"
            errorMessage={errors.country?.message}
            {...register("country")}
          />
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <SelectField
                id="gender"
                name={field.name}
                label="Gender"
                required
                options={genderOptions}
                value={field.value}
                onValueChange={field.onChange}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <Input
            id="dateOfBirth"
            type="date"
            label="Date of birth"
            required
            max={today}
            errorMessage={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
          <div className="sm:col-span-2">
            <Input
              id="profileImage"
              type="file"
              label="Profile image"
              required
              accept="image/jpeg,image/png,image/webp"
              info="Use a clear photo of yourself. JPG, PNG or WebP, up to 5 MB."
              errorMessage={errors.profileImage?.message}
              {...register("profileImage", {
                onChange: (event) => {
                  setProfileImageFile(event.target.files?.[0] ?? null);
                },
              })}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              id="summary"
              label="Brief summary about yourself"
              required
              rows={6}
              placeholder="Tell us briefly about yourself, your teaching approach and what makes you a great tutor."
              errorMessage={errors.summary?.message}
              {...register("summary")}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5">
          <Textarea
            id="expertise"
            label="Areas of expertise / specialisation"
            required
            rows={5}
            placeholder="e.g. Mathematics, Physics, GCSE preparation, primary education..."
            errorMessage={errors.expertise?.message}
            {...register("expertise")}
          />
          <Textarea
            id="qualifications"
            label="Qualifications"
            required
            rows={5}
            placeholder="List your relevant academic, teaching or professional qualifications."
            errorMessage={errors.qualifications?.message}
            {...register("qualifications")}
          />
          <Input
            id="cv"
            type="file"
            label="CV"
            accept="application/pdf"
            info="Optional. PDF only, up to 10 MB."
            errorMessage={errors.cv?.message}
            {...register("cv", {
              onChange: (event) => {
                setCvFile(event.target.files?.[0] ?? null);
              },
            })}
          />
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mt-6 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
        >
          {submitError}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-between">
        <div>
          {step > 0 && (
            <Button type="button" variant="outline" onClick={previousStep}>
              <ArrowLeft />
              Back
            </Button>
          )}
        </div>

        <Button
          type="button"
          size="lg"
          onClick={nextStep}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : step < steps.length - 1
              ? "Next step"
              : "Submit application"}
          <ArrowRight />
        </Button>
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
        By submitting this application, you confirm that the information you
        have provided is accurate and may be reviewed by Three-dmanagers for
        tutor recruitment purposes.
      </p>
    </form>
  );
}
