import Image from "next/image";

export type PublicTutor = {
  id: string;
  name: string;
  specialization: string | null;
  qualification: string | null;
  summary: string | null;
  avatarUrl: string | null;
  subjects: string[];
};

export function TeacherCard({ teacher }: { teacher: PublicTutor }) {
  const initials = teacher.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group h-full rounded-3xl border border-sky-50 bg-white p-6 text-center shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.4)]">
      <div className="mx-auto size-20 overflow-hidden rounded-full bg-sky-500 font-display text-2xl font-extrabold text-white shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105 relative grid place-items-center">
        {teacher.avatarUrl ? (
          <Image
            src={teacher.avatarUrl}
            alt={teacher.name}
            width={80}
            height={80}
            priority
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center">{initials}</div>
        )}
      </div>
      <h2 className="mt-4 font-display text-lg font-extrabold text-foreground">
        {teacher.name}
      </h2>
      {/* <p className="text-sm font-bold text-sky-600">
        {teacher.specialization || "Tutor"}
      </p> */}
      {teacher.subjects.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          {teacher.subjects.slice(0, 3).join(" · ")}
        </p>
      )}
      {/* {teacher.qualification && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Award aria-hidden="true" className="size-4" />
          {teacher.qualification}
        </p>
      )} */}
      {teacher.summary && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {teacher.summary}
        </p>
      )}
    </article>
  );
}
