import { GraduationCap, UserCheck, UserMinus, Users } from "lucide-react";
import { MetricCard, MetricGrid } from "@/components/admin/ui";
import type { StudentMetricsI as StudentMetricsType } from "@/modules/students/types";

export function StudentMetrics({ metrics }: { metrics: StudentMetricsType }) {
  return (
    <MetricGrid>
      <MetricCard label="Total students" value={metrics.total} icon={Users} />
      <MetricCard
        label="Active students"
        value={metrics.active}
        icon={UserCheck}
      />
      <MetricCard
        label="Inactive students"
        value={metrics.inactive}
        icon={UserMinus}
      />
      <MetricCard
        label="Graduated"
        value={metrics.graduated}
        icon={GraduationCap}
      />
    </MetricGrid>
  );
}
