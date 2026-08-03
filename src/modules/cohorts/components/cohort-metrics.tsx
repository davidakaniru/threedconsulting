import { Archive, CheckCircle2, DoorOpen, Layers3 } from "lucide-react";
import { MetricGrid, MetricCard } from "@/components/admin/ui";
import type { CohortMetricsI as M } from "@/modules/cohorts/types";
export function CohortMetrics({ metrics: m }: { metrics: M }) {
  return (
    <MetricGrid>
      <MetricCard label="Total cohorts" value={m.total} icon={Layers3} />
      <MetricCard label="Open" value={m.open} icon={DoorOpen} />
      <MetricCard label="Active" value={m.active} icon={CheckCircle2} />
      <MetricCard label="Archived" value={m.archived} icon={Archive} />
    </MetricGrid>
  );
}
