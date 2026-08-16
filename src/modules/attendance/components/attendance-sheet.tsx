"use client";
import { CheckCheck, UserCheck, UserRoundX } from "lucide-react";
import { MetricCard, MetricGrid, SectionCard } from "@/components/admin/ui";
import type { SessionAttendanceSheet } from "../types";

export function AttendanceSheet({
  sheet,
}: {
  sheet: SessionAttendanceSheet;
  readOnly?: boolean;
}) {
  const values = sheet.records;
  const counts = values.reduce(
    (acc, r) => {
      acc[r.status] += 1;
      return acc;
    },
    { present: 0, absent: 0 } as Record<"present" | "absent", number>,
  );
  const marked = counts.present + counts.absent;
  const rate = marked ? Math.round((counts.present / marked) * 100) : 0;
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
          label="Absent"
          value={counts.absent}
          icon={UserRoundX}
          tone="rose"
        />
        <MetricCard
          label="Attendance rate"
          value={`${rate}%`}
          icon={CheckCheck}
          tone="purple"
        />
      </MetricGrid>
      <SectionCard
        title="Attendance sheet"
        description="Attendance is recorded automatically when the learner joins the meeting."
        contentClassName="p-0"
      >
        <div>
          <div className="flex items-center justify-between gap-3 border-b p-4">
            <p className="text-sm font-medium text-slate-600">
              {sheet.records.length} learner{sheet.records.length === 1 ? "" : "s"}
            </p>
            <p className="text-sm text-slate-500">Automatic attendance</p>
          </div>
          <div className="divide-y">
            {sheet.records.map((record) => (
              <div
                key={record.id}
                className="grid gap-4 p-4 md:grid-cols-[1fr_180px_1fr] md:items-center"
              >
                <div>
                  <p className="font-bold text-slate-950">{record.studentName}</p>
                  <p className="text-xs text-slate-500">{record.admissionNumber}</p>
                </div>
                <div className="font-medium capitalize">{record.status}</div>
                <p className="text-sm text-slate-500">
                  {record.status === "present"
                    ? "Joined the meeting."
                    : "Did not join before the session ended."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
