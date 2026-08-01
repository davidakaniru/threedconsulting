import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const contactMethods = [
  {
    label: "Email us",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    icon: Mail,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    label: "Call us",
    value: "+44 0000 000000",
    href: "tel:+440000000000",
    icon: Phone,
    iconClassName: "bg-coral/10 text-coral",
  },
  {
    label: "Chat on WhatsApp",
    value: "Send us a quick message",
    href: "https://wa.me/440000000000",
    icon: MessageCircle,
    iconClassName: "bg-turquoise/15 text-teal-700",
  },
];

export function ContactDetails() {
  return (
    <aside className="space-y-6">
      <div
        className="rounded-[2.5rem] bg-primary p-7
          text-white sm:p-9"
      >
        <span
          className="font-display text-sm font-bold uppercase
            tracking-wider text-white/75"
        >
          Get in touch
        </span>

        <h2
          className="mt-2 font-display text-3xl font-extrabold
            leading-tight"
        >
          We’d love to hear from you
        </h2>

        <p className="mt-4 leading-7 text-white/80">
          Whether you have a quick question or need help choosing the right
          programme, our team is ready to help.
        </p>

        <div className="mt-8 space-y-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;

            return (
              <Link
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center gap-4
                  rounded-2xl bg-white/10 p-3
                  transition-colors hover:bg-white/15"
              >
                <span
                  className={`grid size-11 shrink-0
                    place-items-center rounded-xl bg-white
                    ${method.iconClassName}`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>

                <span>
                  <span
                    className="block text-xs font-bold
                      uppercase tracking-wide text-white/65"
                  >
                    {method.label}
                  </span>

                  <span
                    className="mt-0.5 block font-display
                      font-bold text-white"
                  >
                    {method.value}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-[2.5rem] bg-purple/10
          p-7 sm:p-9"
      >
        <div className="flex items-start gap-4">
          <span
            className="grid size-12 shrink-0 place-items-center
              rounded-2xl bg-purple text-white"
          >
            <MapPin aria-hidden="true" className="size-6" />
          </span>

          <div>
            <h3
              className="font-display text-xl font-extrabold
                text-foreground"
            >
              Visit our learning centre
            </h3>

            <address
              className="mt-2 not-italic leading-7
                text-muted-foreground"
            >
              24 Learning Lane
              <br />
              London
              <br />
              AB1 2CD
            </address>
          </div>
        </div>
      </div>

      <div
        className="rounded-[2.5rem] bg-warning/15
          p-7 sm:p-9"
      >
        <div className="flex items-start gap-4">
          <span
            className="grid size-12 shrink-0 place-items-center
              rounded-2xl bg-warning text-foreground"
          >
            <Clock3 aria-hidden="true" className="size-6" />
          </span>

          <div className="w-full">
            <h3
              className="font-display text-xl font-extrabold
                text-foreground"
            >
              Opening hours
            </h3>

            <dl
              className="mt-4 space-y-3 text-sm
                text-muted-foreground"
            >
              <div
                className="flex items-center
                  justify-between gap-4"
              >
                <dt>Monday – Friday</dt>
                <dd className="font-semibold text-foreground">9:00 – 18:00</dd>
              </div>

              <div
                className="flex items-center
                  justify-between gap-4"
              >
                <dt>Saturday</dt>
                <dd className="font-semibold text-foreground">9:00 – 16:00</dd>
              </div>

              <div
                className="flex items-center
                  justify-between gap-4"
              >
                <dt>Sunday</dt>
                <dd className="font-semibold text-foreground">Closed</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </aside>
  );
}
