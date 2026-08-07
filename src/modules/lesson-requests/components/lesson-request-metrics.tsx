import { Clock3, ListTodo, Radio, UserCheck } from "lucide-react";
import { MetricCard, MetricGrid } from "@/components/admin/ui";
import type { LessonRequestMetricsI as Metrics } from "../types";

export function LessonRequestMetrics({ metrics }: { metrics: Metrics }) {
  return (
    <MetricGrid>
      <MetricCard label="Total enrolments" value={metrics.total} icon={ListTodo} tone="blue" />
      <MetricCard label="Awaiting review" value={metrics.pendingReview} icon={Clock3} tone="orange" />
      <MetricCard label="Open to teachers" value={metrics.open} icon={Radio} tone="green" />
      <MetricCard label="Matched" value={metrics.matched} icon={UserCheck} tone="purple" />
    </MetricGrid>
  );
}
