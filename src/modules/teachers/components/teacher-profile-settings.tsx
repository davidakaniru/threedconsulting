"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Save, Upload, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useTeacherProfile,
  useUpdateTeacherProfile,
  useUploadTeacherCv,
} from "@/modules/teachers/hooks/use-teacher-profile";
import {
  teacherProfileSchema,
  type TeacherProfileRequest,
} from "@/modules/teachers/schemas";
import type { AuthenticatedUser } from "@/types/auth";
import { toApiError } from "@/lib/api/errors";
import { SelectField } from "@/components/forms/select-field";

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

export function TeacherProfileSettings({
  initialProfile,
}: {
  initialProfile: AuthenticatedUser;
}) {
  const cvInputRef = useRef<HTMLInputElement>(null);
  const query = useTeacherProfile();
  const teacher = query.data;
  const updateMutation = useUpdateTeacherProfile();
  const cvMutation = useUploadTeacherCv();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherProfileRequest>({
    resolver: yupResolver(teacherProfileSchema),
    values: {
      firstName: teacher?.firstName ?? initialProfile.firstName ?? "",
      lastName: teacher?.lastName ?? initialProfile.lastName ?? "",
      email: teacher?.email ?? initialProfile.email,
      phone: teacher?.phone ?? initialProfile.phone ?? "",
      addressLine1: teacher?.addressLine1 ?? "",
      city: teacher?.city ?? "",
      country: teacher?.country ?? "",
      gender: teacher?.gender ?? "female",
      dateOfBirth: teacher?.dateOfBirth ?? initialProfile.dateOfBirth ?? "",
      summary: teacher?.summary ?? "",
      expertise: teacher?.expertise ?? teacher?.specialization ?? "",
      qualifications: teacher?.qualifications ?? teacher?.qualification ?? "",
    },
    mode: "onTouched",
  });

  const submit = handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Teacher profile updated.");
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  });

  async function uploadCv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf")
      return toast.error("Please upload your CV as a PDF.");
    if (file.size > 10 * 1024 * 1024)
      return toast.error("Your CV must be 10 MB or smaller.");
    try {
      await cvMutation.mutateAsync(file);
      toast.success("CV updated.");
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  if (query.isLoading)
    return (
      <div className="rounded-3xl border bg-white p-8 text-sm text-muted-foreground">
        Loading teacher profile...
      </div>
    );
  if (query.isError || !teacher)
    return (
      <div className="rounded-3xl border border-destructive/20 bg-white p-8 text-sm text-destructive">
        Your teacher profile could not be loaded. Please refresh and try again.
      </div>
    );

  return (
    <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <UserRound className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">
            Tutor profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Keep every detail from your tutor application up to date.
          </p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="mt-7 space-y-8">
        <section>
          <h3 className="font-display text-lg font-extrabold">
            Personal information
          </h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Input
              id="teacher-first-name"
              label="First name"
              required
              errorMessage={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              id="teacher-last-name"
              label="Last name"
              required
              errorMessage={errors.lastName?.message}
              {...register("lastName")}
            />
            <Input
              id="teacher-email"
              label="Email address"
              type="email"
              required
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="teacher-phone"
              label="Phone number"
              type="tel"
              required
              errorMessage={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              id="teacher-address"
              label="Address"
              required
              errorMessage={errors.addressLine1?.message}
              {...register("addressLine1")}
            />
            <Input
              id="teacher-city"
              label="City / town"
              required
              errorMessage={errors.city?.message}
              {...register("city")}
            />
            <Input
              id="teacher-country"
              label="Country"
              required
              errorMessage={errors.country?.message}
              {...register("country")}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState }) => (
                <SelectField
                  id="teacher-gender"
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
              id="teacher-dob"
              type="date"
              label="Date of birth"
              required
              errorMessage={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
          </div>
        </section>

        <section className="border-t border-border/70 pt-7">
          <h3 className="font-display text-lg font-extrabold">
            Professional information
          </h3>
          <div className="mt-4 grid gap-5">
            <Textarea
              id="teacher-summary"
              label="Brief summary about yourself"
              required
              rows={6}
              placeholder="Tell us briefly about yourself, your teaching approach and what makes you a great tutor."
              errorMessage={errors.summary?.message}
              {...register("summary")}
            />
            <Textarea
              id="teacher-expertise"
              label="Areas of expertise / specialisation"
              required
              rows={5}
              placeholder="e.g. Mathematics, Physics, GCSE preparation, primary education..."
              errorMessage={errors.expertise?.message}
              {...register("expertise")}
            />
            <Textarea
              id="teacher-qualifications"
              label="Qualifications"
              required
              rows={5}
              placeholder="List your relevant academic, teaching or professional qualifications."
              errorMessage={errors.qualifications?.message}
              {...register("qualifications")}
            />
          </div>
        </section>

        <section className="border-t border-border/70 pt-7">
          <h3 className="font-display text-lg font-extrabold">CV</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload the current version of your CV. PDF only, up to 10 MB.
          </p>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={uploadCv}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={cvMutation.isPending}
            onClick={() => cvInputRef.current?.click()}
          >
            <Upload className="size-4" />
            {cvMutation.isPending
              ? "Uploading..."
              : teacher.cvPath
                ? "Replace CV"
                : "Upload CV"}
          </Button>
        </section>

        <div className="flex justify-end border-t border-border/70 pt-6">
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="size-4" />
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}
