import { Briefcase, GraduationCap } from "lucide-react";

const services = [
  {
    title: "Online tutoring",
    eyebrow: "For learners aged 4–18",
    description:
      "Quality online tutoring for children aged 4-18, supporting learners across the globe with personalised curriculum from Primary to high school. Our personalised approach helps students strengthen their academic performance, build confidence and develop essential skills for lifelong learning.",
    icon: GraduationCap,
    className: "bg-sky-100",
    iconClassName: "bg-primary text-white",
  },
  {
    title: "Business consulting",
    eyebrow: "For organisations",
    description:
      "Professional business consulting and transformation support, helping organisations improve processes, solve business challenges and turn ideas into practical, sustainable outcomes.",
    icon: Briefcase,
    className: "bg-purple/15",
    iconClassName: "bg-purple text-white",
  },
];

export function AboutServices() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="font-display text-sm font-bold uppercase
              tracking-wider text-purple"
          >
            What we do
          </span>

          <h2
            className="mt-3 font-display text-3xl font-extrabold
              leading-tight text-foreground md:text-4xl"
          >
            Two ways we help you grow
          </h2>

          <p
            className="mt-4 text-lg leading-relaxed
              text-muted-foreground"
          >
            Whether we&apos;re supporting a learner or a business, our goal
            is the same: real, practical progress.
          </p>
        </div>

        <div
          className="mt-12 grid gap-6
            sm:grid-cols-2"
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className={`rounded-3xl p-7 sm:p-10 ${service.className}`}
              >
                <div
                  className={`grid size-14 place-items-center
                    rounded-2xl ${service.iconClassName}`}
                >
                  <Icon aria-hidden="true" className="size-7" />
                </div>

                <span
                  className="mt-6 block font-display text-sm
                    font-bold uppercase tracking-wider
                    text-foreground/65"
                >
                  {service.eyebrow}
                </span>

                <h3
                  className="mt-2 font-display text-2xl
                    font-extrabold text-foreground"
                >
                  {service.title}
                </h3>

                <p
                  className="mt-3 leading-7
                    text-muted-foreground"
                >
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
