"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ComboboxField } from "@/components/forms/combobox-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SelectOption } from "@/types/form";

export function TeacherReportFilters({
  month,
  teacherId,
  teachers,
}: {
  month: string;
  teacherId?: string;
  teachers: SelectOption[];
}) {
  const router = useRouter();
  const [selectedTeacherId, setSelectedTeacherId] = useState(teacherId ?? "");
  const [selectedMonth, setSelectedMonth] = useState(month);

  return (
    <form
      className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_190px_auto] sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        if (!selectedTeacherId) return;

        const params = new URLSearchParams({
          teacherId: selectedTeacherId,
          month: selectedMonth,
        });
        router.push(`/portal/admin/reports/teachers?${params.toString()}`);
      }}
    >
      <ComboboxField
        label="Tutor"
        required
        options={teachers}
        value={selectedTeacherId}
        onValueChange={setSelectedTeacherId}
        placeholder="Select a teacher"
        searchPlaceholder="Search teacher by name or ID..."
        emptyText="No teacher found."
      />

      <label className="text-xs font-medium text-foreground">
        Report month
        <Input
          id="report-month"
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="mt-1"
        />
      </label>

      <Button type="submit" disabled={!selectedTeacherId}>
        View report
      </Button>
    </form>
  );
}
