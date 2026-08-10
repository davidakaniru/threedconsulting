import Link from "next/link";
import { CalendarClock, Pencil, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InfoCard,
  MetricCard,
  MetricGrid,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import type { Homework } from "../types";
export function HomeworkDetails({ homework }: { homework: Homework }) {
  return (
    <div className="space-y-6">
      <SectionCard contentClassName="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">
              {homework.session.lesson.student.name} ·{" "}
              {homework.session.lesson.programme.name}
            </p>
            <h2 className="font-display text-2xl font-extrabold">
              {homework.title}
            </h2>
            <div className="mt-3">
              <StatusBadge status={homework.status} />
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/portal/teacher/homework/${homework.id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        </div>
      </SectionCard>
      <SectionCard title="Homework information" contentClassName="p-6">
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {homework.instructions}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={CalendarClock}
            title="Due"
            description={new Date(homework.dueAt).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          />
          <InfoCard
            icon={Users}
            title="Session"
            description={homework.session.title}
          />
          <InfoCard
            icon={Users}
            title="Maximum score"
            description={
              homework.maximumScore == null
                ? "Not graded"
                : String(homework.maximumScore)
            }
          />
        </div>
      </SectionCard>
      <SectionCard
        title="Submission summary"
        description="Submission access will be surfaced through the Parent Portal for each linked child."
        contentClassName="p-6"
      >
        <MetricGrid>
          <MetricCard
            label="Total learners"
            value={homework.submissions.total}
            icon={Users}
          />
          <MetricCard
            label="Pending"
            value={homework.submissions.pending}
            icon={Users}
          />
          <MetricCard
            label="Submitted / Late"
            value={homework.submissions.submitted + homework.submissions.late}
            icon={Users}
          />
          <MetricCard
            label="Graded"
            value={homework.submissions.graded}
            icon={Users}
          />
        </MetricGrid>
      </SectionCard>
    </div>
  );
}
