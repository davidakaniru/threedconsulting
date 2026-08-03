"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarPlus, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/forms/select-field";
import { toApiError } from "@/lib/api/errors";
import { classSessionSchema, type ClassSessionRequest } from "../schemas";
import { classSessionStatusOptions } from "../constants";
import { useCreateSession, useUpdateSession } from "../hooks";
import type { ClassSession } from "../types";
type CohortOption = {
  id: string;
  code: string;
  name: string;
  programme: { name: string };
};
export function SessionForm({
  session,
  cohorts,
}: {
  session?: ClassSession;
  cohorts: CohortOption[];
}) {
  const router = useRouter();
  const create = useCreateSession();
  const update = useUpdateSession(session?.id ?? "");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSessionRequest>({
    resolver: yupResolver(classSessionSchema),
    mode: "onTouched",
    defaultValues: {
      cohortId: session?.cohortId ?? "",
      title: session?.title ?? "",
      description: session?.description ?? "",
      sessionDate:
        session?.sessionDate ?? new Date().toISOString().slice(0, 10),
      startTime: session?.startTime?.slice(0, 5) ?? "",
      endTime: session?.endTime?.slice(0, 5) ?? "",
      meetingLink: session?.meetingLink ?? "",
      status: session?.status ?? "draft",
    },
  });
  const submit = handleSubmit(async (v) => {
    try {
      if (session) {
        const create = await update.mutateAsync(v);
        toast.success("Session updated.");
        router.push(`/portal/teacher/sessions/${create.id}`);
      } else {
        const saved = await create.mutateAsync(v);
        toast.success("Session created.");
        router.push(`/portal/teacher/sessions/${saved.id}`);
      }
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name="cohortId"
          control={control}
          render={({ field }) => (
            <SelectField
              id="cohortId"
              label="Cohort"
              required
              options={cohorts.map((c) => ({
                value: c.id,
                label: `${c.code} · ${c.name} · ${c.programme.name}`,
              }))}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={errors.cohortId?.message}
              className="sm:col-span-2"
            />
          )}
        />
        <Input
          id="title"
          label="Title"
          required
          placeholder="e.g. Introduction to algebra"
          errorMessage={errors.title?.message}
          {...register("title")}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectField
              id="status"
              label="Status"
              required
              options={classSessionStatusOptions}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={errors.status?.message}
            />
          )}
        />
        <Input
          id="sessionDate"
          type="date"
          label="Session date"
          required
          errorMessage={errors.sessionDate?.message}
          {...register("sessionDate")}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="startTime"
            type="time"
            label="Start time"
            required
            errorMessage={errors.startTime?.message}
            {...register("startTime")}
          />
          <Input
            id="endTime"
            type="time"
            label="End time"
            required
            errorMessage={errors.endTime?.message}
            {...register("endTime")}
          />
        </div>
        <Input
          id="meetingLink"
          type="url"
          label="Meeting link"
          required
          placeholder="https://meet.google.com/..."
          errorMessage={errors.meetingLink?.message}
          className="sm:col-span-2"
          {...register("meetingLink")}
        />
        <Textarea
          id="description"
          label="Description"
          rows={5}
          className="sm:col-span-2"
          errorMessage={errors.description?.message}
          {...register("description")}
        />
      </div>
      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={create.isPending || update.isPending}>
          {session ? <Save /> : <CalendarPlus />}
          {create.isPending || update.isPending
            ? "Saving..."
            : session
              ? "Save changes"
              : "Create session"}
        </Button>
      </div>
    </form>
  );
}
