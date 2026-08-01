import { ShieldCheck } from "lucide-react";

import { AuthLogo } from "./auth-logo";

const benefits = [
  "Private, role-based access",
  "Clear updates without the paperwork",
  "Designed for desktop, tablet and mobile",
];

export function AuthBrandPanel() {
  return (
    <section className="hidden lg:block">
      <AuthLogo />

      <div className="mt-16">
        <p
          className="inline-flex items-center gap-2 rounded-full
            bg-white/90 px-4 py-2 text-sm font-bold text-primary
            shadow-[0_12px_35px_-20px_rgba(56,116,189,0.5)]
            backdrop-blur"
        >
          One connected learning journey
        </p>

        <h1
          className="mt-5 max-w-xl font-display text-5xl
            font-extrabold leading-[1.05] text-foreground
            xl:text-6xl"
        >
          Your learning world, all in one{" "}
          <span className="text-primary">happy place.</span>
        </h1>

        <p
          className="mt-5 max-w-lg text-lg leading-8
            text-muted-foreground"
        >
          Keep progress, people and plans beautifully connected—with a portal
          made for your role.
        </p>

        <div className="mt-8 space-y-4">
          {benefits.map((benefit) => (
            <p
              key={benefit}
              className="flex items-center gap-3 font-semibold
                text-foreground"
            >
              <span
                className="grid size-8 shrink-0 place-items-center
                  rounded-xl bg-turquoise/15 text-teal-700"
              >
                <ShieldCheck aria-hidden="true" className="size-4" />
              </span>

              {benefit}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
