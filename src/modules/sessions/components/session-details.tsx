import Link from "next/link";
import {
  CalendarCheck2,
  CalendarDays,
  Clock,
  Pencil,
  Users,
} from "lucide-react";
import {
  InfoCard,
  MetricGrid,
  MetricCard,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { SessionJoinButton } from "./session-join-button";
import type { ClassSession } from "../types";
export function SessionDetails({
  session,
  admin = false,
}: {
  session: ClassSession;
  admin?: boolean;
}) {
  return (
    <div className="space-y-6">
      <SectionCard contentClassName="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">
              {admin
                ? session.lessonAssignment.programme.name
                : `${session.lessonAssignment.student.name} · ${session.lessonAssignment.programme.name}`}
            </p>
            <h2 className="font-display text-2xl font-extrabold">
              {session.title}
            </h2>
            <div className="mt-3">
              <StatusBadge status={session.status} />
            </div>
          </div>
          <div className="flex gap-2">
            {admin && (
              <Button variant="outline" asChild>
                <Link href={`/portal/admin/sessions/${session.id}/attendance`}>
                  <CalendarCheck2 />
                  View attendance
                </Link>
              </Button>
            )}
            {!admin && (
              <>
                <Button variant="outline" asChild>
                  <Link
                    href={`/portal/teacher/sessions/${session.id}/attendance`}
                  >
                    <CalendarCheck2 />
                    Take attendance
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/portal/teacher/sessions/${session.id}/edit`}>
                    <Pencil />
                    Edit
                  </Link>
                </Button>
              </>
            )}
            {!admin && (
              <SessionJoinButton
                sessionId={session.id}
                sessionDate={session.sessionDate}
                startTime={session.startTime}
                endTime={session.endTime}
                status={session.status}
                role="teacher"
              />
            )}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Session information" contentClassName="p-6">
        <p className="text-sm leading-7 text-slate-600">
          {session.description || "No description has been added."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={CalendarDays}
            title="Date"
            description={new Date(
              `${session.sessionDate}T00:00:00`,
            ).toLocaleDateString("en-GB")}
          />
          <InfoCard
            icon={Clock}
            title="Time"
            description={`${session.startTime.slice(0, 5)} – ${session.endTime.slice(0, 5)}`}
          />
          {admin ? (
            <InfoCard
              icon={Users}
              title="Subject"
              description={session.lessonAssignment.programme.name}
            />
          ) : (
            <InfoCard
              icon={Users}
              title="Child"
              description={session.lessonAssignment.student.name}
            />
          )}
          <InfoCard
            icon={Users}
            title="Teacher"
            description={session.lessonAssignment.teacher.name}
          />
        </div>
      </SectionCard>
      <SectionCard
        title="Attendance summary"
        description="Attendance records are generated automatically when the session is scheduled."
        contentClassName="p-6"
      >
        <MetricGrid>
          <MetricCard
            label="Total"
            value={session.attendance.total}
            icon={Users}
          />
          <MetricCard
            label="Pending"
            value={session.attendance.pending}
            icon={Clock}
          />
          <MetricCard
            label="Present"
            value={session.attendance.present}
            icon={Users}
          />
          <MetricCard
            label="Absent / Late"
            value={session.attendance.absent + session.attendance.late}
            icon={Users}
          />
        </MetricGrid>
      </SectionCard>
    </div>
  );
}
