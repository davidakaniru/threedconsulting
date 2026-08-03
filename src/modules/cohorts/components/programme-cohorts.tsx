import Link from "next/link";
import { Layers3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionCard, StatusBadge } from "@/components/admin/ui";
import { getCohorts } from "@/modules/cohorts/server";
export async function ProgrammeCohorts({
  programmeId,
}: {
  programmeId: string;
}) {
  const data = await getCohorts({ programmeId, pageSize: 100 });
  return (
    <SectionCard
      title="Cohorts"
      description="Groups progressing together through this programme."
      action={
        <Button size="sm" asChild>
          <Link href={`/portal/admin/cohorts/new?programmeId=${programmeId}`}>
            <Plus />
            Create cohort
          </Link>
        </Button>
      }
      contentClassName="p-5"
    >
      {data.cohorts.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {data.cohorts.map((c) => (
            <Link
              key={c.id}
              href={`/portal/admin/cohorts/${c.id}`}
              className="rounded-2xl border p-4 transition hover:border-primary/40"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-primary">{c.code}</p>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.teacher.name}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers3}
          title="No cohorts created"
          description="Create the first cohort after assigning a teacher."
        />
      )}
    </SectionCard>
  );
}
