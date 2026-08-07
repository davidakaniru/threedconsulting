import type { EnrolmentFormValues } from "@/lib/schemas/enrolment-schema";
import { lessonDays } from "@/data/enrolment";
interface Props { values: EnrolmentFormValues; programmeLabel?: string; }
function Row({ label, value }: { label: string; value: React.ReactNode }) { return <div className="grid gap-1 border-b border-border/70 py-3 last:border-0 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-semibold text-muted-foreground">{label}</dt><dd className="text-sm font-semibold text-foreground">{value || "Not provided"}</dd></div>; }
export function EnrolmentSummary({ values, programmeLabel }: Props) {
  const days = lessonDays.filter((day) => values.preferredDays.includes(day.value)).map((day) => day.label).join(", ");
  return <div className="rounded-3xl bg-primary/4 px-5 py-2"><dl>
    {!values.hasParentAccount && <><Row label="Parent" value={`${values.parentFirstName ?? ""} ${values.parentLastName ?? ""}`} /><Row label="Email" value={values.email} /><Row label="Phone" value={values.phone} /></>}
    <Row label="Child" value={`${values.childFirstName} ${values.childLastName}`} /><Row label="Date of birth" value={values.childDateOfBirth} />
    <Row label="Subject" value={programmeLabel} /><Row label="Preferred days" value={days} /><Row label="Preferred time" value={values.preferredTime} /><Row label="Duration" value={`${values.durationMonths} ${values.durationMonths === 1 ? "month" : "months"}`} />
    {values.additionalMessage && <Row label="Additional message" value={values.additionalMessage} />}
  </dl></div>;
}
