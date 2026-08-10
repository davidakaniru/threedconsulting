"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function TeacherReportMonthPicker({ month }: { month: string }) {
  const router = useRouter();
  const [value, setValue] = useState(month);
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/portal/admin/reports/teachers?month=${value}`);
      }}
    >
      <label className="text-sm font-semibold text-foreground">
        Report month
        <Input
          id="report-month"
          type="month"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 min-w-48"
        />
      </label>
      <Button type="submit">View report</Button>
    </form>
  );
}
