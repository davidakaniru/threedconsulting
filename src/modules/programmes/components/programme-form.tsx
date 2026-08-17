"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, BookPlus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/forms/select-field";
import { toApiError } from "@/lib/api/errors";
import { programmeStatusOptions } from "@/modules/programmes/constants";
import {
  useCreateProgramme,
  useUpdateProgramme,
} from "@/modules/programmes/hooks";
import {
  createProgrammeSchema,
  type CreateProgrammeRequest,
} from "@/modules/programmes/schemas";
import type { ProgrammeDetail } from "@/modules/programmes/types";
export function ProgrammeForm({ programme }: { programme?: ProgrammeDetail }) {
  const router = useRouter();
  const create = useCreateProgramme();
  const update = useUpdateProgramme(programme?.id ?? "");
  const mutation = programme ? update : create;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProgrammeRequest>({
    resolver: yupResolver(createProgrammeSchema),
    mode: "onTouched",
    defaultValues: {
      name: programme?.name ?? "",
      description: programme?.description ?? "",
      status: programme?.status ?? "draft",
    },
  });
  const submit = handleSubmit(async (values) => {
    try {
      const saved = await mutation.mutateAsync(values);
      toast.success(programme ? "Subject updated." : "Subject created.");
      router.push(`/portal/admin/programmes/${saved.id}`);
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-5">
        <Input
          id="name"
          label="Subject name"
          required
          placeholder="e.g. Mathematics"
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              id="status"
              label="Status"
              required
              options={programmeStatusOptions}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={errors.status?.message}
            />
          )}
        />
        <Textarea
          id="description"
          label="Description"
          rows={6}
          placeholder="Describe what learners will study..."
          errorMessage={errors.description?.message}
          {...register("description")}
        />
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link
            href={
              programme
                ? `/portal/admin/programmes/${programme.id}`
                : "/portal/admin/programmes"
            }
          >
            <ArrowLeft />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {programme ? <Save /> : <BookPlus />}
          {mutation.isPending
            ? "Saving..."
            : programme
              ? "Save changes"
              : "Create subject"}
        </Button>
      </div>
    </form>
  );
}
