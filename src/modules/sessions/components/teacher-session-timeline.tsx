"use client";
import Link from "next/link";
import { CalendarDays, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionCard, StatusBadge } from "@/components/admin/ui";
import { useTeacherSessions } from "../hooks";
export function TeacherSessionTimeline() {
  const q = useTeacherSessions({ pageSize: 100 });
  if (q.isLoading)
    return <SectionCard contentClassName="p-6">Loading sessions…</SectionCard>;
  if (q.isError)
    return (
      <SectionCard contentClassName="p-6">
        Sessions could not be loaded.
      </SectionCard>
    );
  const sessions = q.data?.sessions ?? [];
  const groups = new Map<string, typeof sessions>();
  sessions.forEach((s) => {
    const key = new Date(`${s.sessionDate}T00:00:00`).toLocaleDateString(
      "en-GB",
      { month: "long", year: "numeric" },
    );
    groups.set(key, [...(groups.get(key) ?? []), s]);
  });
  return (
    <div className="space-y-6">
      {sessions.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No sessions yet"
          description="Create the first online session for one of your active lessons."
          action={
            <Button asChild>
              <Link href="/portal/teacher/sessions/new">
                <Plus />
                New session
              </Link>
            </Button>
          }
        />
      ) : (
        Array.from(groups.entries()).map(([month, items]) => (
          <SectionCard key={month} title={month} contentClassName="p-0">
            <div className="divide-y divide-slate-100">
              {items.map((s) => (
                <Link
                  key={s.id}
                  href={`/portal/teacher/sessions/${s.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(`${s.sessionDate}T00:00:00`).toLocaleDateString(
                        "en-GB",
                        { weekday: "short", day: "numeric", month: "short" },
                      )}{" "}
                      · {s.startTime.slice(0, 5)} ·{" "}
                      {s.lessonAssignment.student.name} ·{" "}
                      {s.lessonAssignment.programme.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={s.status} />
                    <ExternalLink className="size-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        ))
      )}
    </div>
  );
}
