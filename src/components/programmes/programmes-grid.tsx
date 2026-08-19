import { ProgrammeCard } from "@/components/home/programme-card";
import { getPublishedProgrammesForPublic } from "@/modules/programmes/server";

export async function ProgrammesGrid() {
  const programmes = await getPublishedProgrammesForPublic();

  return (
    <section className="-mt-8 bg-[#fff8ee] px-5 pb-16 sm:px-8 md:pb-24">
      <div className="relative mx-auto max-w-7xl">
        {programmes.length === 0 ? (
          <div className="rounded-3xl border border-sky-50 bg-white p-10 text-center text-muted-foreground">
            No subjects are currently available.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
