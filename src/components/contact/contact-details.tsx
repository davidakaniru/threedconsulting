import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

type ContactMethod = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
};

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
const whatsapp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.trim();
const address = process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim();
const weekdayHours = process.env.NEXT_PUBLIC_CONTACT_HOURS_WEEKDAYS?.trim();

const contactMethods: ContactMethod[] = [];

if (email) {
  contactMethods.push({
    label: "Email us",
    value: email,
    href: `mailto:${email}`,
    icon: Mail,
    iconClassName: "bg-primary/10 text-primary",
  });
}

if (phone) {
  contactMethods.push({
    label: "Call us",
    value: phone,
    href: `tel:${phone.replace(/[^+\d]/g, "")}`,
    icon: Phone,
    iconClassName: "bg-coral/10 text-coral",
  });
}

if (whatsapp) {
  contactMethods.push({
    label: "Chat on WhatsApp",
    value: "Send us a quick message",
    href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    icon: MessageCircle,
    iconClassName: "bg-turquoise/15 text-teal-700",
  });
}

const hours = [
  ["Monday-Friday", "9am-9pm"],
  ["Saturday", "9am-8pm"],
  ["Sunday", "2pm-8pm"],
].filter((item): item is [string, string] => Boolean(item));

export function ContactDetails() {
  return (
    <aside className="space-y-6">
      <div className="rounded-[2.5rem] bg-primary p-7 text-white sm:p-9">
        <span className="font-display text-sm font-bold uppercase tracking-wider text-white/75">
          Get in touch
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight">
          We’d love to hear from you
        </h2>
        <p className="mt-4 leading-7 text-white/80">
          Whether you have a quick question or need help choosing the right
          programme, our team is ready to help.
        </p>

        {contactMethods.length > 0 && (
          <div className="mt-8 space-y-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Link
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  className="group flex items-center gap-4 rounded-2xl bg-white/10 p-3 transition-colors hover:bg-white/15"
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl bg-white ${method.iconClassName}`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wide text-white/65">
                      {method.label}
                    </span>
                    <span className="mt-0.5 block font-display font-bold text-white">
                      {method.value}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {address && (
        <div className="rounded-[2.5rem] bg-purple/10 p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-purple text-white">
              <MapPin aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-extrabold text-foreground">
                Visit our learning centre
              </h3>
              <address className="mt-2 whitespace-pre-line not-italic leading-7 text-muted-foreground">
                {address}
              </address>
            </div>
          </div>
        </div>
      )}

      {hours.length > 0 && (
        <div className="rounded-[2.5rem] bg-warning/15 p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-warning text-foreground">
              <Clock3 aria-hidden="true" className="size-6" />
            </span>
            <div className="w-full">
              <h3 className="font-display text-xl font-extrabold text-foreground">
                Opening hours
              </h3>
              <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                {hours.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt>{label}</dt>
                    <dd className="font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
