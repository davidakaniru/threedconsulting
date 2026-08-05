import { AuthLogo } from "./auth-logo";

export function AuthBrandPanel() {
  return (
    <section className="hidden lg:block">
      <AuthLogo />

      <div className="mt-16">
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
      </div>
    </section>
  );
}
