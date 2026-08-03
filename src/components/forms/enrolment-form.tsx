"use client";

import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";

import { EnrolmentStepper } from "@/components/enrolment/enrolment-stepper";
import { EnrolmentSummary } from "@/components/enrolment/enrolment-summary";
import { ProgrammeCheckbox } from "@/components/enrolment/programme-checkbox";

import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { enrolmentSteps, preferredFormatOptions } from "@/data/enrolment";
import { cn } from "@/lib/utils";
import {
  EnrolmentFormValues,
  enrolmentSchema,
} from "@/lib/schemas/enrolment-schema";


const defaultValues: EnrolmentFormValues = {
  childFirstName: "",
  childLastName: "",
  childDateOfBirth: "",
  preferredFormat: "",
  programmes: [],
  parentName: "",
  email: "",
  phone: "",
  additionalInformation: "",
  acceptedTerms: false,
};

export function EnrolmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [programmeOptions, setProgrammeOptions] = useState<Array<{id:string;name:string;slug:string}>>([]);

  const methods = useForm<EnrolmentFormValues>({
    resolver: yupResolver(enrolmentSchema),
    defaultValues,
    mode: "onTouched",
    shouldUnregister: false,
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedProgrammes = useWatch({ control, name: "programmes" });
  const preferredFormat = useWatch({ control, name: "preferredFormat" });

  const preferredFormatLabel = preferredFormatOptions.find((o) =>
    preferredFormat.includes(o.value),
  )?.label;
  const selectedProgrammesLabels = programmeOptions
    .filter((programme) => selectedProgrammes.includes(programme.id))
    .map((programme) => programme.name);

  useEffect(() => {
    fetch("/api/public/programmes")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load programmes")))
      .then((payload) => setProgrammeOptions(payload.data ?? []))
      .catch(() => setSubmitError("Programmes could not be loaded. Please refresh the page."));
  }, []);

  async function goToNextStep() {
    const currentFields = enrolmentSteps[currentStep].fields;

    const isStepValid = await trigger([...currentFields], {
      shouldFocus: true,
    });

    if (!isStepValid) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, enrolmentSteps.length - 1));
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function onSubmit(formValues: EnrolmentFormValues) {
    setSubmitted(false);

    try {
      setSubmitError("");
      const response = await fetch("/api/parent/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Please sign in with a parent account before submitting an enrolment.");
        }
        throw new Error(payload?.error?.message ?? "Unable to submit enrolment.");
      }
      setSubmitted(true);
      reset(defaultValues);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit enrolment.");
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-[2.5rem] bg-white p-7 text-center
          shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)]
          sm:p-10"
      >
        <span
          className="mx-auto grid size-16 place-items-center
            rounded-full bg-turquoise/15 text-teal-700"
        >
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </span>

        <h2
          className="mt-5 font-display text-3xl font-extrabold
            text-foreground"
        >
          You’re all set!
        </h2>

        <p
          className="mx-auto mt-3 max-w-lg leading-7
            text-muted-foreground"
        >
          We’ve received your enrolment. A member of our team will contact you
          within one working day to help match your child with the right
          programme and teacher.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-7"
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(0);
          }}
        >
          Submit another enrolment
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-3xl">
        <EnrolmentStepper steps={enrolmentSteps} currentStep={currentStep} />

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 rounded-[2.5rem] bg-white p-6
            shadow-[0_25px_80px_-35px_rgba(56,116,189,0.32)]
            sm:p-8 lg:p-10"
        >
          {currentStep === 0 && (
            <section
              aria-labelledby="child-details-heading"
              className="space-y-5"
            >
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                  Step 1 of 4
                </p>

                <h2
                  id="child-details-heading"
                  className="mt-2 font-display text-2xl font-extrabold
                    text-foreground sm:text-3xl"
                >
                  Tell us about your child
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These details help us recommend the most suitable classes.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="child-first-name"
                  label="Child’s first name"
                  placeholder="Maya"
                  autoComplete="off"
                  required
                  errorMessage={errors.childFirstName?.message}
                  {...register("childFirstName")}
                />

                <Input
                  id="child-last-name"
                  label="Child’s last name"
                  placeholder="Taylor"
                  autoComplete="off"
                  required
                  errorMessage={errors.childLastName?.message}
                  {...register("childLastName")}
                />

                <Input
                  id="child-date-of-birth"
                  type="date"
                  label="Date of birth"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  errorMessage={errors.childDateOfBirth?.message}
                  {...register("childDateOfBirth")}
                />
              </div>

              <Controller
                name="preferredFormat"
                control={control}
                render={({ field, fieldState }) => (
                  <SelectField
                    id="preferred-format"
                    name={field.name}
                    label="Preferred format"
                    placeholder="Choose a format"
                    options={preferredFormatOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </section>
          )}

          {currentStep === 1 && (
            <section aria-labelledby="programmes-heading" className="space-y-5">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                  Step 2 of 4
                </p>

                <h2
                  id="programmes-heading"
                  className="mt-2 font-display text-2xl font-extrabold
                    text-foreground sm:text-3xl"
                >
                  Which programmes interest you?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Select one or more. Our team will help you confirm the best
                  fit.
                </p>
              </div>

              <Controller
                name="programmes"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {programmeOptions.map((programme) => {
                        const isChecked = field.value.includes(programme.id);

                        return (
                          <ProgrammeCheckbox
                            key={programme.id}
                            id={`programme-${programme.slug}`}
                            label={programme.name}
                            checked={isChecked}
                            onCheckedChange={(checked: boolean) => {
                              const nextValue = checked
                                ? [...field.value, programme.id]
                                : field.value.filter(
                                    (value) => value !== programme.id,
                                  );

                              field.onChange(nextValue);
                            }}
                          />
                        );
                      })}
                    </div>

                    {fieldState.error?.message && (
                      <p
                        role="alert"
                        className="mt-2 text-xs font-medium
                          text-destructive"
                      >
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </section>
          )}

          {currentStep === 2 && (
            <section
              aria-labelledby="parent-details-heading"
              className="space-y-5"
            >
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                  Step 3 of 4
                </p>

                <h2
                  id="parent-details-heading"
                  className="mt-2 font-display text-2xl font-extrabold
                    text-foreground sm:text-3xl"
                >
                  Your details
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We’ll use these details to contact you about the enrolment.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="parent-name"
                  label="Parent or guardian name"
                  placeholder="Rebecca Taylor"
                  autoComplete="name"
                  required
                  errorMessage={errors.parentName?.message}
                  {...register("parentName")}
                />

                <Input
                  id="parent-email"
                  type="email"
                  label="Email address"
                  placeholder="rebecca@example.com"
                  autoComplete="email"
                  required
                  errorMessage={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Input
                id="parent-phone"
                type="tel"
                label="Phone number"
                placeholder="+44 0000 000000"
                autoComplete="tel"
                inputMode="tel"
                required
                errorMessage={errors.phone?.message}
                {...register("phone")}
              />

              <Textarea
                id="additional-information"
                label="Anything we should know?"
                placeholder="Learning goals, support needs, questions..."
                rows={4}
                className="resize-none"
                info="Optional"
                errorMessage={errors.additionalInformation?.message}
                {...register("additionalInformation")}
              />
            </section>
          )}

          {currentStep === 3 && (
            <section
              aria-labelledby="confirmation-heading"
              className="space-y-5"
            >
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                  Step 4 of 4
                </p>

                <h2
                  id="confirmation-heading"
                  className="mt-2 font-display text-2xl font-extrabold
                    text-foreground sm:text-3xl"
                >
                  Almost there!
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Check that everything looks right before submitting your
                  enrolment.
                </p>
              </div>

              <EnrolmentSummary
                values={getValues()}
                programmeLabels={selectedProgrammesLabels}
                formatLabel={preferredFormatLabel}
              />

              <div>
                <label
                  htmlFor="accepted-terms"
                  className={cn(
                    "flex cursor-pointer items-start gap-3",
                    "rounded-2xl border px-4 py-4",
                    errors.acceptedTerms
                      ? "border-destructive bg-destructive/2.5"
                      : "border-primary/10 bg-primary/4",
                  )}
                >
                  <input
                    id="accepted-terms"
                    type="checkbox"
                    className="mt-0.5 size-5 rounded-md accent-primary"
                    {...register("acceptedTerms")}
                  />

                  <span className="text-sm leading-6 text-foreground">
                    I agree to the terms and conditions and the child
                    safeguarding policy.
                  </span>
                </label>

                {errors.acceptedTerms?.message && (
                  <p
                    role="alert"
                    className="mt-2 text-xs font-medium
                      text-destructive"
                  >
                    {errors.acceptedTerms.message}
                  </p>
                )}
              </div>
            </section>
          )}

          {submitError && <p role="alert" className="mt-5 text-sm font-medium text-destructive">{submitError}</p>}

          <div
            className="mt-8 flex items-center justify-between
              gap-3 border-t border-border/70 pt-6"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={goToPreviousStep}
              className={cn(
                currentStep === 0 && "invisible pointer-events-none",
              )}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Button>

            {currentStep < enrolmentSteps.length - 1 ? (
              <Button type="button" onClick={goToNextStep}>
                Continue
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            ) : (
              <Button type="submit" variant="coral" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit enrolment"}

                {!isSubmitting && (
                  <Check aria-hidden="true" className="size-4" />
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
