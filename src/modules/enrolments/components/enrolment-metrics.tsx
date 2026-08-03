import {
  CheckCircle2,
  Clock3,
  FileText,
  SearchCheck,
  XCircle,
} from "lucide-react";
import { MetricCard, MetricGrid } from "@/components/admin/ui";
import type { EnrolmentMetricsI as M } from "../types";
export function EnrolmentMetrics({ metrics: m }: { metrics: M }) {
  return (
    <MetricGrid>
      <MetricCard label="Total applications" value={m.total} icon={FileText} />
      <MetricCard label="Pending" value={m.pending} icon={Clock3} />
      <MetricCard
        label="Under review"
        value={m.underReview}
        icon={SearchCheck}
      />
      <MetricCard label="Approved" value={m.approved} icon={CheckCircle2} />
      <MetricCard label="Rejected" value={m.rejected} icon={XCircle} />
    </MetricGrid>
  );
}
