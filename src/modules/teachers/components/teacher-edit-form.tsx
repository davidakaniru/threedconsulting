"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/api/errors";
import { useUpdateTeacher } from "@/modules/teachers/hooks";
import {
  updateTeacherSchema,
  type UpdateTeacherRequest,
} from "@/modules/teachers/schemas";
import type { TeacherDetail } from "@/modules/teachers/types";

export function TeacherEditForm({ teacher }: { teacher: TeacherDetail }) {
  const router = useRouter();
  const mutation = useUpdateTeacher(teacher.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTeacherRequest>({
    resolver: yupResolver(updateTeacherSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: teacher.firstName ?? "",
      lastName: teacher.lastName ?? "",
      employeeId: teacher.employeeId,
      phone: teacher.phone ?? "",
      address: teacher.address ?? "",
      qualification: teacher.qualification ?? "",
      specialization: teacher.specialization ?? "",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Teacher details updated.");
      router.push(`/portal/admin/teachers/${teacher.id}`);
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
            id="lastName"
            label="Last name"
            required
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            id="email"
            type="email"
            label="Email address"
            value={teacher.email}
            disabled
            info="Email changes are managed through the account system."
          />
          <Input
            id="phone"
            type="tel"
            label="Phone number"
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />
          <div className="sm:col-span-2">
            <Textarea
              id="address"
              label="Address"
              rows={3}
              className="resize-none"
              errorMessage={errors.address?.message}
              {...register("address")}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-7">
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Employment and professional information
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Input
            id="employeeId"
            label="Employee ID"
            required
            errorMessage={errors.employeeId?.message}
            {...register("employeeId")}
          />
          <Input
            id="hireDate"
            label="Hire date"
            value={teacher.hireDate}
            disabled
            info="Recorded automatically when the teacher was added."
          />
          <Input
            id="qualification"
            label="Qualification"
            errorMessage={errors.qualification?.message}
            {...register("qualification")}
          />
          <Input
            id="specialization"
            label="Specialization"
            errorMessage={errors.specialization?.message}
            {...register("specialization")}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href={`/portal/admin/teachers/${teacher.id}`}>
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
