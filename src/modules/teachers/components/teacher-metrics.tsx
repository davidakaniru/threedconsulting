import { Clock3, UserCheck, UserRoundPlus, Users } from "lucide-react";
import { MetricCard, MetricGrid } from "@/components/admin/ui";
import type { TeacherMetricsI as TeacherMetricsType } from "@/modules/teachers/types";

export function TeacherMetrics({ metrics }: { metrics: TeacherMetricsType }) {
  return (
    <MetricGrid>
      <MetricCard label="Total teachers" value={metrics.total} icon={Users} />
      <MetricCard
        label="Active"
        value={metrics.active}
        icon={UserCheck}
        tone="green"
      />
      <MetricCard
        label="Awaiting activation"
        value={metrics.invited}
        icon={UserRoundPlus}
        tone="orange"
      />
      <MetricCard
        label="On leave"
        value={metrics.onLeave}
        icon={Clock3}
        tone="blue"
      />
    </MetricGrid>
  );
}
