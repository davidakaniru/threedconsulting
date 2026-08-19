"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createTeacherSchema,
  type CreateTeacherRequest,
} from "@/modules/teachers/schemas";
import { useCreateTeacher } from "@/modules/teachers/hooks";
import { toApiError } from "@/lib/api/errors";

type ProgrammeOption = { id: string; name: string };

export function CreateTeacherForm({
  programmes,
}: {
  programmes: ProgrammeOption[];
}) {
  const router = useRouter();
  const mutation = useCreateTeacher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeacherRequest>({
    resolver: yupResolver(createTeacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      qualification: "",
      specialization: "",
      programmeIds: [],
    },
    mode: "onTouched",
  });
  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Teacher invited successfully.");
      router.push("/portal/admin/teachers");
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
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
          required
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="qualification"
          label="Qualification"
          placeholder="e.g. B.Ed Early Childhood Education"
          errorMessage={errors.qualification?.message}
          {...register("qualification")}
        />
        <Input
          id="specialization"
          label="Specialization"
          placeholder="e.g. Mathematics"
          errorMessage={errors.specialization?.message}
          {...register("specialization")}
        />
      </div>

      <fieldset className="space-y-3">
        <div>
          <legend className="text-sm font-semibold text-foreground">
            Programmes <span className="text-destructive">*</span>
          </legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Select every programme this teacher is eligible to teach.
          </p>
        </div>
        {programmes.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {programmes.map((programme) => (
              <label
                key={programme.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  value={programme.id}
                  {...register("programmeIds")}
                  className="size-4 accent-primary"
                />
                <span>{programme.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            No published programmes are available. Publish a programme before
            adding a teacher.
          </p>
        )}
        {errors.programmeIds?.message ? (
          <p className="text-sm font-medium text-destructive">
            {errors.programmeIds.message}
          </p>
        ) : null}
      </fieldset>

      <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
        The teacher ID is generated automatically. The teacher will receive an
        account invitation by email; no password is sent or stored in plaintext.
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" asChild>
          <Link href="/portal/admin/teachers">
            <ArrowLeft />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending || programmes.length === 0}>
          {mutation.isPending ? (
            "Sending invitation..."
          ) : (
            <>
              <Send />
              Add & invite teacher
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
