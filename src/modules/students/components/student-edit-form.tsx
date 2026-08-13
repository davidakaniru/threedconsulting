"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/api/errors";
import { studentStatusOptions } from "@/modules/students/constants";
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
      admissionDate: student.admissionDate,
      status: student.status,
      notes: student.notes ?? "",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Admission information updated.");
      router.push(`/portal/admin/students/${student.id}`);
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  });

  return (
    <form noValidate onSubmit={submit} className="space-y-8">
      <section>
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Admission information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personal details and profile photos are managed by the child's parent.
        </p>

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
          {mutation.isPending ? "Saving..." : "Save admission changes"}
        </Button>
      </div>
    </form>
  );
}
