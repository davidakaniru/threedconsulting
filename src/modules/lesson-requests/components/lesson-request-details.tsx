import type { ReactNode } from "react";
import { InfoCard, SectionCard, StatusBadge } from "@/components/admin/ui";
import { Radio, UserCheck } from "lucide-react";
import { formatDateTime, formatTime } from "@/lib/date";
import type { LessonRequestDetail } from "../types";
import { LessonRequestActions } from "./lesson-request-actions";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid gap-1 border-b py-3 last:border-0 sm:grid-cols-[190px_1fr]">
    <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
    <dd className="text-sm font-semibold">{value || "—"}</dd>
  </div>
);

function dayLabel(day: string) { return day.charAt(0).toUpperCase() + day.slice(1); }

export function LessonRequestDetails({ request }: { request: LessonRequestDetail }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Enrolment details" action={<StatusBadge status={request.status} label={request.status === "pending_review" ? "Awaiting review" : undefined} />}>
        <dl>
          <Row label="Child" value={request.childName} />
          <Row label="Date of birth" value={new Date(request.childDateOfBirth).toLocaleDateString("en-GB")} />
          <Row label="Subject" value={request.programme.name} />
          <Row label="Preferred days" value={request.preferredDays.map(dayLabel).join(", ")} />
          <Row label="Preferred time" value={formatTime(request.preferredTime)} />
          <Row label="Lesson duration" value={`${request.durationMonths} ${request.durationMonths === 1 ? "month" : "months"}`} />
          <Row label="Parent" value={request.parentName} />
          <Row label="Email" value={request.parentEmail} />
          <Row label="Phone" value={request.parentPhone} />
          <Row label="Submitted" value={formatDateTime(request.createdAt)} />
          <Row label="Additional message" value={request.additionalMessage} />
        </dl>
      </SectionCard>

      {request.status === "open" && (
        <InfoCard icon={Radio} title="Open to eligible teachers" description={`Teachers assigned to ${request.programme.name} can now view this enrolment opportunity. It remains available until one teacher successfully accepts it.`} />
      )}
      {request.matchedTeacherId && (
        <InfoCard icon={UserCheck} title="Teacher matched" description="This enrolment has been accepted. Teacher and parent-facing assignment details will be completed in R3/R4." />
      )}
      <LessonRequestActions request={request} />
    </div>
  );
}
