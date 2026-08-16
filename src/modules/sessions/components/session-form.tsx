"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarPlus, FileDown, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/forms/select-field";
import { toApiError } from "@/lib/api/errors";
import { classSessionSchema, type ClassSessionRequest } from "../schemas";
import { useCreateSession, useUpdateSession } from "../hooks";
import type { ClassSession } from "../types";
type LessonOption = {
  id: string;
  studentName: string;
  programme: { name: string };
  sessionTime: string;
};
export function SessionForm({
  session,
  lessons,
  initialLessonAssignmentId,
}: {
  session?: ClassSession;
  lessons: LessonOption[];
  initialLessonAssignmentId?: string;
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
      lessonAssignmentId:
        session?.lessonAssignmentId ?? initialLessonAssignmentId ?? "",
      title: session?.title ?? "",
      description: session?.description ?? "",
      sessionDate:
        session?.sessionDate ?? new Date().toISOString().slice(0, 10),
      startTime: session?.startTime?.slice(0, 5) ?? "",
      endTime: session?.endTime?.slice(0, 5) ?? "",
      meetingLink: session?.meetingLink ?? "",
    },
  });
  const submit = handleSubmit(async (v) => {
    try {
      const saved = session
        ? await update.mutateAsync(v)
        : await create.mutateAsync({ ...v, action: "schedule" });
      toast.success(session ? "Session updated." : "Session scheduled.");
      router.push(`/portal/teacher/sessions/${saved.id}`);
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  const saveAsDraft = handleSubmit(async (v) => {
    try {
      const saved = await create.mutateAsync({ ...v, action: "draft" });
      toast.success("Session saved as draft.");
      router.push(`/portal/teacher/sessions/${saved.id}`);
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  const schedule = handleSubmit(async (v) => {
    try {
      const saved = await create.mutateAsync({ ...v, action: "schedule" });
      toast.success("Session scheduled.");
      router.push(`/portal/teacher/sessions/${saved.id}`);
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  const scheduleDraft = handleSubmit(async (v) => {
    if (!session) return;
    try {
      const saved = await update.mutateAsync({ ...v, action: "schedule" });
      toast.success("Session scheduled.");
      router.push(`/portal/teacher/sessions/${saved.id}`);
    } catch (e) {
      toast.error(toApiError(e).message);
    }
  });
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name="lessonAssignmentId"
          control={control}
          render={({ field }) => (
            <SelectField
              id="lessonAssignmentId"
              label="Lesson"
              required
              options={lessons.map((l) => ({
                value: l.id,
                label: `${l.studentName} · ${l.programme.name}`,
              }))}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={errors.lessonAssignmentId?.message}
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
      <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
        {session ? (
          <>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              <Save />
              {update.isPending ? "Saving..." : "Save changes"}
            </Button>
            {session.status === "draft" && (
              <Button
                type="button"
                disabled={create.isPending || update.isPending}
                onClick={() => void scheduleDraft()}
              >
                <CalendarPlus />
                {update.isPending ? "Scheduling..." : "Schedule session"}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={create.isPending || update.isPending}
              onClick={() => void saveAsDraft()}
            >
              <FileDown />
              {create.isPending ? "Saving..." : "Save as draft"}
            </Button>
            <Button
              type="button"
              disabled={create.isPending || update.isPending}
              onClick={() => void schedule()}
            >
              <CalendarPlus />
              {create.isPending ? "Scheduling..." : "Create session"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
