"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/forms/select-field";
import { toApiError } from "@/lib/api/errors";
import {
  studentGenderOptions,
  studentStatusOptions,
} from "@/modules/students/constants";
import { useUpdateStudent } from "@/modules/students/hooks";
import {
  updateStudentSchema,
  type UpdateStudentRequest,
} from "@/modules/students/schemas";
import type { StudentDetail } from "@/modules/students/types";

export function StudentEditForm({ student }: { student: StudentDetail }) {
  const router = useRouter();
  const mutation = useUpdateStudent(student.id);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentRequest>({
    resolver: yupResolver(updateStudentSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: student.firstName,
      middleName: student.middleName ?? "",
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender ?? "",
      admissionDate: student.admissionDate,
      status: student.status,
      notes: student.notes ?? "",
    },
  });
  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Student details updated.");
      router.push(`/portal/admin/students/${student.id}`);
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  });
  return (
    <form noValidate onSubmit={submit} className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Personal information
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Input
            id="firstName"
            label="First name"
            required
            errorMessage={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="middleName"
            label="Middle name"
            errorMessage={errors.middleName?.message}
            {...register("middleName")}
          />
          <Input
            id="lastName"
            label="Last name"
            required
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            id="dateOfBirth"
            type="date"
            label="Date of birth"
            required
            errorMessage={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SelectField
                id="gender"
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
      <section className="border-t border-slate-100 pt-7">
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Admission information
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Input
            id="admissionNumber"
            label="Admission number"
            value={student.admissionNumber}
            disabled
            info="Generated automatically and cannot be changed."
          />
          <Input
            id="admissionDate"
            type="date"
            label="Admission date"
            required
            errorMessage={errors.admissionDate?.message}
            {...register("admissionDate")}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectField
                id="status"
                label="Status"
                required
                options={studentStatusOptions}
                value={field.value}
                onValueChange={field.onChange}
                errorMessage={errors.status?.message}
              />
            )}
          />
          <div className="sm:col-span-2">
            <Textarea
              id="notes"
              label="Administrative notes"
              rows={4}
              errorMessage={errors.notes?.message}
              {...register("notes")}
            />
          </div>
        </div>
      </section>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href={`/portal/admin/students/${student.id}`}>
            <ArrowLeft />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          <Save />
          {mutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
