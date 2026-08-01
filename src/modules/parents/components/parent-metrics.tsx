import { MetricGrid, MetricCard } from "@/components/admin/ui";
import { Users, UserCheck, Mail, ShieldAlert } from "lucide-react";
import type { ParentMetricsI } from "@/modules/parents/types";
export function ParentMetrics({ metrics }: { metrics: ParentMetricsI }) {
  return (
    <MetricGrid>
      <MetricCard label="Total parents" value={metrics.total} icon={Users} />
      <MetricCard label="Active" value={metrics.active} icon={UserCheck} />
      <MetricCard label="Invited" value={metrics.invited} icon={Mail} />
      <MetricCard
        label="Suspended"
        value={metrics.suspended}
        icon={ShieldAlert}
      />
    </MetricGrid>
  );
}
