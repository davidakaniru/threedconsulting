import { BookOpen, Rocket, Users } from "lucide-react";

const items = [
  {
    eyebrow: "Our mission",
    title: "Empowering people, strengthening organisations",
    description:
      "To empower individuals, strengthen organisations and build brighter futures through quality education, professional expertise and innovative solutions.",
    icon: Rocket,
    className: "bg-sky-100",
    iconClassName: "bg-primary text-white",
  },
  {
    eyebrow: "Our approach",
    title: "People, Purpose and Progress",
    description:
      "We listen, understand the unique needs of those we serve and work collaboratively to create solutions that deliver real value.",
    icon: Users,
    className: "bg-purple/15",
    iconClassName: "bg-purple text-white",
  },
];

export function MissionVision() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
      <div
        className="mx-auto grid max-w-7xl gap-6
          lg:grid-cols-2"
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.eyebrow}
              className={`relative overflow-hidden rounded-[2.5rem]
                p-7 sm:p-10 ${item.className}`}
            >
              <BookOpen
                aria-hidden="true"
                className="absolute right-8 top-7
                  size-9 text-white/70"
              />

              <div
                className={`grid size-14 place-items-center
                  rounded-2xl ${item.iconClassName}`}
              >
                <Icon aria-hidden="true" className="size-7" />
              </div>

              <span
                className="mt-7 block font-display text-sm
                  font-bold uppercase tracking-wider
                  text-foreground/65"
              >
                {item.eyebrow}
              </span>

              <h2
                className="mt-2 max-w-lg font-display text-3xl
                  font-extrabold leading-tight text-foreground"
              >
                {item.title}
              </h2>

              <p
                className="mt-4 max-w-xl text-lg leading-8
                  text-muted-foreground"
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
