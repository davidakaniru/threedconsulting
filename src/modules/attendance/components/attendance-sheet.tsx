"use client";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCheck, Clock3, Save, UserCheck, UserRoundX } from "lucide-react";
import { toast } from "sonner";
import { MetricCard, MetricGrid, SectionCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/forms/select-field";
import { attendanceUpdateSchema, type AttendanceUpdateInput } from "../schemas";
import type { SessionAttendanceSheet } from "../types";
import { useSaveAttendance } from "../hooks";

const options = [
  { label: "Pending", value: "pending" },
  { label: "Present", value: "present" },
  { label: "Late", value: "late" },
  { label: "Absent", value: "absent" },
];

export function AttendanceSheet({
  sheet,
  readOnly = false,
}: {
  sheet: SessionAttendanceSheet;
  readOnly?: boolean;
}) {
  const mutation = useSaveAttendance(sheet.session.id);
  const editable = sheet.editable && !readOnly;
  const form = useForm<AttendanceUpdateInput>({
    resolver: yupResolver(attendanceUpdateSchema),
    defaultValues: {
      records: sheet.records.map((r) => ({
        attendanceId: r.id,
        status: r.status,
        notes: r.notes ?? "",
      })),
    },
  });
  const fields = useFieldArray({ control: form.control, name: "records" });
  useEffect(() => {
    form.reset({
      records: sheet.records.map((r) => ({
        attendanceId: r.id,
        status: r.status,
        notes: r.notes ?? "",
      })),
    });
  }, [sheet.records, form]);
  const values = form.watch("records");
  const counts = values.reduce(
    (acc, r) => ({ ...acc, [r.status]: acc[r.status] + 1 }),
    { pending: 0, present: 0, absent: 0, late: 0 } as Record<string, number>,
  );
  const marked = counts.present + counts.absent + counts.late;
  const rate = marked
    ? Math.round(((counts.present + counts.late) / marked) * 100)
    : 0;
  const markAllPresent = () =>
    fields.fields.forEach((_, index) =>
      form.setValue(`records.${index}.status`, "present", {
        shouldDirty: true,
      }),
    );
  const submit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync({ records: data.records });
      toast.success("Attendance saved successfully.");
    } catch (error: any) {
      toast.error(error?.message ?? "Attendance could not be saved.");
    }
  });
  return (
    <div className="space-y-6">
      <MetricGrid>
        <MetricCard
          label="Present"
          value={counts.present}
          icon={UserCheck}
          tone="green"
        />
        <MetricCard
          label="Late"
          value={counts.late}
          icon={Clock3}
          tone="orange"
        />
        <MetricCard
          label="Absent"
          value={counts.absent}
          icon={UserRoundX}
          tone="rose"
        />
        <MetricCard label="Pending" value={counts.pending} icon={Clock3} />
        <MetricCard
          label="Attendance rate"
          value={`${rate}%`}
          icon={CheckCheck}
          tone="purple"
        />
      </MetricGrid>
      <SectionCard
        title="Attendance sheet"
        description={
          editable
            ? "Mark each learner, then save the full sheet once."
            : "Attendance is read-only."
        }
        contentClassName="p-0"
      >
        <form onSubmit={submit}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <p className="text-sm font-medium text-slate-600">
              {sheet.records.length} learner
              {sheet.records.length === 1 ? "" : "s"}
            </p>
            {editable && (
              <Button type="button" variant="outline" onClick={markAllPresent}>
                <CheckCheck />
                Mark everyone present
              </Button>
            )}
          </div>
          <div className="divide-y">
            {fields.fields.map((field, index) => {
              const student = sheet.records[index];
              return (
                <div
                  key={field.id}
                  className="grid gap-4 p-4 md:grid-cols-[1fr_180px_1fr] md:items-end"
                >
                  <div>
                    <p className="font-bold text-slate-950">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {student.admissionNumber}
                    </p>
                  </div>
                  <Controller
                    control={form.control}
                    name={`records.${index}.status`}
                    render={({ field: statusField }) => (
                      <SelectField
                        id={`status-${student.id}`}
                        label="Status"
                        options={options}
                        value={statusField.value}
                        onValueChange={statusField.onChange}
                        disabled={!editable}
                      />
                    )}
                  />
                  <Input
                    id={`notes-${student.id}`}
                    label="Notes"
                    placeholder="Optional note"
                    disabled={!editable}
                    {...form.register(`records.${index}.notes`)}
                  />
                </div>
              );
            })}
          </div>
          {editable && (
            <div className="flex justify-end border-t p-4">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || mutation.isPending}
              >
                <Save />
                {mutation.isPending ? "Saving..." : "Save attendance"}
              </Button>
            </div>
          )}
        </form>
      </SectionCard>
    </div>
  );
}
