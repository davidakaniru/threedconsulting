import { aboutValues } from "@/data/about";

export function AboutValues() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="font-display text-sm font-bold uppercase
              tracking-wider text-purple"
          >
            What guides us
          </span>

          <h2
            className="mt-3 font-display text-3xl font-extrabold
              leading-tight text-foreground md:text-4xl"
          >
            Values you can feel in every lesson
          </h2>

          <p
            className="mt-4 text-lg leading-relaxed
              text-muted-foreground"
          >
            These principles shape how we teach, communicate and care for every
            member of our learning community.
          </p>
        </div>

        <div
          className="mt-12 grid gap-6
            sm:grid-cols-2 lg:grid-cols-6"
        >
          {aboutValues.map((value, index) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className={`rounded-3xl p-6
                  ${value.cardClassName}
                  ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              >
                <div
                  className={`grid size-12 place-items-center
                    rounded-2xl ${value.iconClassName}`}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </div>

                <h3
                  className="mt-5 font-display text-xl
                    font-extrabold text-foreground"
                >
                  {value.title}
                </h3>

                <p
                  className="mt-2 leading-7
                    text-muted-foreground"
                >
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
