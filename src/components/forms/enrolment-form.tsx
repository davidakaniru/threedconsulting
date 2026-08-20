"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { EnrolmentStepper } from "@/components/enrolment/enrolment-stepper";
import { EnrolmentSummary } from "@/components/enrolment/enrolment-summary";
import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  durationOptions,
  getEnrolmentSteps,
  lessonDays,
} from "@/data/enrolment";
import {
  enrolmentSchema,
  type EnrolmentFormValues,
} from "@/lib/schemas/enrolment-schema";
import type { ParentEnrolmentChild } from "@/modules/lesson-requests/types";

type Props = {
  hasParentAccount?: boolean;
  parentName?: string | null;
  parentEmail?: string | null;
  existingChildren?: ParentEnrolmentChild[];
  initialExistingStudentId?: string | null;
};
export function EnrolmentForm({
  hasParentAccount = false,
  parentName,
  parentEmail,
  existingChildren = [],
  initialExistingStudentId,
}: Props) {
  const initialChild =
    existingChildren.find((child) => child.id === initialExistingStudentId) ??
    existingChildren[0] ??
    null;
  const steps = useMemo(
    () => getEnrolmentSteps(hasParentAccount),
    [hasParentAccount],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState<{
    id: string;
    requiresEmailConfirmation: boolean;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [programmeOptions, setProgrammeOptions] = useState<
    Array<{ id: string; name?: string; title?: string; slug: string }>
  >([]);
  const methods = useForm<EnrolmentFormValues>({
    resolver: yupResolver(enrolmentSchema),
    defaultValues: {
      hasParentAccount,
      childMode: hasParentAccount && initialChild ? "existing" : "new",
      existingStudentId: initialChild?.id ?? "",
      parentFirstName: "",
      parentLastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      childFirstName: initialChild?.firstName ?? "",
      childLastName: initialChild?.lastName ?? "",
      childDateOfBirth: initialChild?.dateOfBirth ?? "",
      currentEducationLevel: initialChild?.currentEducationLevel ?? "",
      programmeIds: [],
      programmeId: "",
      preferredDays: [],
      preferredTime: "",
      durationMonths: 1,
      additionalMessage: "",
      acceptedTerms: false,
    },
    mode: "onTouched",
    shouldUnregister: false,
  });
  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;
  const preferredDays = useWatch({ control, name: "preferredDays" });
  const programmeIds = useWatch({ control, name: "programmeIds" }) ?? [];
  const childMode = useWatch({ control, name: "childMode" });
  const existingStudentId = useWatch({ control, name: "existingStudentId" });
  useEffect(() => {
    fetch("/api/public/programmes")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => setProgrammeOptions(p.data ?? []))
      .catch(() =>
        setSubmitError(
          "Subjects could not be loaded. Please refresh the page.",
        ),
      );
  }, []);
  function selectExistingChild(studentId: string) {
    const child = existingChildren.find((item) => item.id === studentId);
    methods.setValue("existingStudentId", studentId, { shouldValidate: true });
    if (!child) return;
    methods.setValue("childFirstName", child.firstName);
    methods.setValue("childLastName", child.lastName);
    methods.setValue("childDateOfBirth", child.dateOfBirth);
    methods.setValue(
      "currentEducationLevel",
      child.currentEducationLevel ?? "",
      { shouldValidate: true },
    );
  }

  function switchChildMode(mode: "existing" | "new") {
    methods.setValue("childMode", mode, { shouldValidate: true });
    if (mode === "existing") {
      const child =
        existingChildren.find((item) => item.id === existingStudentId) ??
        existingChildren[0];
      if (child) selectExistingChild(child.id);
      return;
    }
    methods.setValue("existingStudentId", "");
    methods.setValue("childFirstName", "");
    methods.setValue("childLastName", "");
    methods.setValue("childDateOfBirth", "");
    methods.setValue("currentEducationLevel", "");
  }

  async function next() {
    if (await trigger([...steps[currentStep].fields], { shouldFocus: true }))
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }
  async function onSubmit(values: EnrolmentFormValues) {
    setSubmitError("");
    try {
      const response = await fetch("/api/public/lesson-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          programmeId: values.programmeIds[0],
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(
          payload?.error?.message ?? "Unable to submit your enrolment.",
        );
      setSubmitted(payload.data);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Unable to submit your enrolment.",
      );
    }
  }
  if (submitted)
    return (
      <div className="rounded-[2.5rem] bg-white p-7 text-center shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)] sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-turquoise/15 text-teal-700">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold">
          Enrolment received
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
          We&apos;ll review your request and match your child to a suitable
          teacher for the selected subject(s).
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Reference:{" "}
          <strong className="text-foreground">
            {submitted.id.slice(0, 8).toUpperCase()}
          </strong>
        </p>
        {submitted.requiresEmailConfirmation ? (
          <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-primary/5 p-4 text-sm text-muted-foreground">
            <Mail className="mx-auto mb-2 size-5 text-primary" />
            Please check your email and confirm your new parent account. Your
            enrolment has already been saved.
          </div>
        ) : (
          <Button asChild className="mt-7">
            <Link href="/portal/parent">
              <LayoutDashboard />
              Go to parent portal
            </Link>
          </Button>
        )}
      </div>
    );
  const step = steps[currentStep].id;
  const selectedProgrammes = programmeOptions
    .filter((p) => programmeIds.includes(p.id))
    .map((p) => p.title ?? p.name ?? "Subject");
  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-3xl">
        <EnrolmentStepper steps={steps} currentStep={currentStep} />
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 rounded-[2.5rem] bg-white p-6 shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)] sm:p-8 lg:p-10"
        >
          {step === "parent" && (
            <section className="space-y-5">
              <Header
                kicker={`Step ${currentStep + 1} of ${steps.length}`}
                title="Create your parent account"
                text="Your parent account and enrolment are created in one journey."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="parent-first-name"
                  label="First name"
                  required
                  errorMessage={errors.parentFirstName?.message}
                  {...register("parentFirstName")}
                />
                <Input
                  id="parent-last-name"
                  label="Last name"
                  required
                  errorMessage={errors.parentLastName?.message}
                  {...register("parentLastName")}
                />
              </div>
              <Input
                id="parent-email"
                type="email"
                label="Email address"
                required
                errorMessage={errors.email?.message}
                {...register("email")}
              />
              <Input
                id="parent-phone"
                label="Phone number"
                required
                errorMessage={errors.phone?.message}
                {...register("phone")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="parent-password"
                  type="password"
                  label="Password"
                  required
                  info="At least 8 characters, with uppercase, lowercase and a number."
                  errorMessage={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  id="parent-confirm-password"
                  type="password"
                  label="Confirm password"
                  required
                  errorMessage={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Already have a parent account?{" "}
                <Link
                  className="font-semibold text-primary"
                  href="/sign-in?next=/enrolment"
                >
                  Sign in first
                </Link>
                .
              </p>
            </section>
          )}
          {step === "child" && (
            <section className="space-y-5">
              <Header
                kicker={`Step ${currentStep + 1} of ${steps.length}`}
                title={
                  hasParentAccount && parentName
                    ? `Who is this lesson for, ${parentName}?`
                    : "Tell us about your child"
                }
                text={
                  hasParentAccount && parentEmail
                    ? `Choose a child already linked to ${parentEmail}, or add another child.`
                    : "These details identify the child this enrolment is for."
                }
              />

              {hasParentAccount && existingChildren.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant={childMode === "existing" ? "default" : "outline"}
                    onClick={() => switchChildMode("existing")}
                  >
                    Existing child
                  </Button>
                  <Button
                    type="button"
                    variant={childMode === "new" ? "default" : "outline"}
                    onClick={() => switchChildMode("new")}
                  >
                    Add another child
                  </Button>
                </div>
              )}

              {childMode === "existing" && existingChildren.length > 0 ? (
                <>
                  <Controller
                    name="existingStudentId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        id="existing-student-id"
                        name={field.name}
                        label="Child"
                        placeholder="Choose a child"
                        options={existingChildren.map((child) => ({
                          label: child.fullName,
                          value: child.id,
                        }))}
                        value={field.value ?? ""}
                        onValueChange={selectExistingChild}
                        required
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                  {existingStudentId && (
                    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                        Existing child
                      </p>
                      <p className="mt-1 font-display text-lg font-extrabold">
                        {existingChildren.find(
                          (child) => child.id === existingStudentId,
                        )?.fullName ?? "Selected child"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Their existing profile will be reused. This creates a
                        new enrolment, not another child record.
                      </p>
                    </div>
                  )}
                  <Input
                    id="current-education-level"
                    label="Current class / education level"
                    placeholder="e.g. Primary 5, JSS 2, Year 6"
                    required
                    info="Update this if your child has moved to a new class since the previous lesson."
                    errorMessage={errors.currentEducationLevel?.message}
                    {...register("currentEducationLevel")}
                  />
                </>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="child-first-name"
                    label="Child’s first name"
                    required
                    errorMessage={errors.childFirstName?.message}
                    {...register("childFirstName")}
                  />
                  <Input
                    id="child-last-name"
                    label="Child’s last name"
                    required
                    errorMessage={errors.childLastName?.message}
                    {...register("childLastName")}
                  />
                  <Input
                    id="child-date-of-birth"
                    type="date"
                    label="Date of birth"
                    max={new Date().toISOString().slice(0, 10)}
                    required
                    errorMessage={errors.childDateOfBirth?.message}
                    {...register("childDateOfBirth")}
                  />
                  <Input
                    id="current-education-level"
                    label="Current class / education level"
                    placeholder="e.g. Primary 5, JSS 2, Year 6"
                    required
                    errorMessage={errors.currentEducationLevel?.message}
                    {...register("currentEducationLevel")}
                  />
                </div>
              )}
            </section>
          )}
          {step === "lesson" && (
            <section className="space-y-6">
              <Header
                kicker={`Step ${currentStep + 1} of ${steps.length}`}
                title="Tell us what lessons you need"
                text="Choose one or more subjects, the days that work for your child, your preferred time and how long you want the arrangement to run."
              />
              <div>
                <p className="mb-3 text-sm font-semibold">
                  Subjects <span className="text-destructive">*</span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {programmeOptions.map((programme) => {
                    const checked = programmeIds.includes(programme.id);
                    return (
                      <label
                        key={programme.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-medium transition ${checked ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 accent-primary"
                          checked={checked}
                          onChange={(event) => {
                            const next = event.target.checked
                              ? [...programmeIds, programme.id]
                              : programmeIds.filter(
                                  (id) => id !== programme.id,
                                );
                            methods.setValue("programmeIds", next, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            methods.setValue("programmeId", next[0] ?? "");
                          }}
                        />
                        <span>
                          {programme.title ?? programme.name ?? "Subject"}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.programmeIds?.message && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {errors.programmeIds.message}
                  </p>
                )}
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold">
                  Preferred days <span className="text-destructive">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {lessonDays.map((day) => (
                    <label
                      key={day.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium ${preferredDays.includes(day.value) ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={preferredDays.includes(day.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...preferredDays, day.value]
                            : preferredDays.filter((v) => v !== day.value);
                          methods.setValue("preferredDays", next, {
                            shouldValidate: true,
                          });
                        }}
                      />
                      {day.label}
                    </label>
                  ))}
                </div>
                {errors.preferredDays?.message && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    {errors.preferredDays.message}
                  </p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="preferred-time"
                  type="time"
                  label="Preferred time"
                  required
                  errorMessage={errors.preferredTime?.message}
                  {...register("preferredTime")}
                />
                <Controller
                  name="durationMonths"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectField
                      id="duration-months"
                      name={field.name}
                      label="Lesson duration"
                      options={durationOptions}
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                      required
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <Textarea
                id="additional-message"
                label="Additional message (optional)"
                placeholder="Is there anything else you would like us to know about your child or their learning needs?"
                rows={5}
                errorMessage={errors.additionalMessage?.message}
                {...register("additionalMessage")}
              />
            </section>
          )}
          {step === "confirm" && (
            <section className="space-y-5">
              <Header
                kicker={`Step ${currentStep + 1} of ${steps.length}`}
                title="Review your enrolment"
                text="Make sure the selected subjects, schedule and other details are correct before submitting."
              />
              <EnrolmentSummary
                values={getValues()}
                programmeLabels={selectedProgrammes}
              />
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  {...register("acceptedTerms")}
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-purple underline-offset-2 hover:underline"
                  >
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-purple underline-offset-2 hover:underline"
                  >
                    privacy policy
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptedTerms?.message && (
                <p className="text-xs font-medium text-destructive">
                  {errors.acceptedTerms.message}
                </p>
              )}
            </section>
          )}
          {submitError && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-destructive/5 p-3 text-sm text-destructive"
            >
              {submitError}
            </p>
          )}
          <div className="mt-8 flex justify-between gap-3">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                <ArrowLeft />
                Back
              </Button>
            ) : (
              <span />
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit enrolment"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
function Header({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
