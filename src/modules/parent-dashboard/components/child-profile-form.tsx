"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { toast } from "sonner";

import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toApiError } from "@/lib/api/errors";
import { studentGenderOptions } from "@/modules/students/constants";
import {
  useUpdateParentStudent,
  useUploadParentStudentPhoto,
} from "@/modules/students/hooks";
import {
  updateStudentPersonalSchema,
  type UpdateStudentPersonalRequest,
} from "@/modules/students/schemas";
import type { StudentDetail } from "@/modules/students/types";

function childName(student: StudentDetail) {
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");
}

function initials(student: StudentDetail) {
  return `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`
    .toUpperCase()
    .slice(0, 2);
}

export function ChildProfileForm({ student }: { student: StudentDetail }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const update = useUpdateParentStudent(student.id);
  const upload = useUploadParentStudentPhoto(student.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentPersonalRequest>({
    resolver: yupResolver(updateStudentPersonalSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: student.firstName,
      middleName: student.middleName ?? "",
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      currentEducationLevel: student.currentEducationLevel ?? "",
      gender: student.gender ?? "",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync(values);
      toast.success("Child profile updated.");
      router.push("/portal/parent");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  });

  async function changePhoto(file?: File) {
    if (!file) return;

    try {
      await upload.mutateAsync(file);
      toast.success("Child profile photo updated.");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-8">
      <section className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-primary/10 font-display text-xl font-extrabold text-primary">
          {student.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.photoUrl}
              alt={`${childName(student)} profile`}
              className="size-full object-cover"
            />
          ) : (
            initials(student)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold">
            {childName(student)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {student.admissionNumber}
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => void changePhoto(event.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            disabled={upload.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera />
            {upload.isPending ? "Uploading..." : "Change photo"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG or WebP. Maximum 2 MB.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-extrabold">
          Personal information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your child's personal and current education details up to date.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input
            id="child-first-name"
            label="First name"
            required
            errorMessage={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="child-middle-name"
            label="Middle name"
            errorMessage={errors.middleName?.message}
            {...register("middleName")}
          />
          <Input
            id="child-last-name"
            label="Last name"
            required
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            id="child-date-of-birth"
            type="date"
            label="Date of birth"
            required
            errorMessage={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
          <Input
            id="child-current-education-level"
            label="Current class / education level"
            required
            placeholder="e.g. Primary 5, JSS 2, Year 8"
            errorMessage={errors.currentEducationLevel?.message}
            {...register("currentEducationLevel")}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SelectField
                id="child-gender"
                label="Gender"
                options={studentGenderOptions}
                value={field.value}
                onValueChange={field.onChange}
                errorMessage={errors.gender?.message}
              />
            )}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href="/portal/parent">
            <ArrowLeft />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={update.isPending}>
          <Save />
          {update.isPending ? "Saving..." : "Save child profile"}
        </Button>
      </div>
    </form>
  );
}
