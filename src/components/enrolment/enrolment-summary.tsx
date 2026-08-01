import { EnrolmentFormValues } from "@/lib/schemas/enrolment-schema";

interface EnrolmentSummaryProps {
  values: EnrolmentFormValues;
  programmeLabels: string[];
  formatLabel?: string;
}

interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="grid gap-1 border-b border-border/70 py-3 last:border-0 sm:grid-cols-[150px_1fr]">
      <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>

      <dd className="text-sm font-semibold text-foreground">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

export function EnrolmentSummary({
  values,
  programmeLabels,
  formatLabel,
}: EnrolmentSummaryProps) {
  return (
    <div className="rounded-3xl bg-primary/4 px-5 py-2">
      <dl>
        <SummaryRow label="Child" value={values.childFirstName} />

        <SummaryRow label="Age" value={values.childAge} />

        <SummaryRow label="Format" value={formatLabel} />

        <SummaryRow label="Programmes" value={programmeLabels.join(", ")} />

        <SummaryRow label="Parent" value={values.parentName} />

        <SummaryRow label="Email" value={values.email} />

        <SummaryRow label="Phone" value={values.phone} />

        {values.additionalInformation && (
          <SummaryRow
            label="Additional notes"
            value={values.additionalInformation}
          />
        )}
      </dl>
    </div>
  );
}
