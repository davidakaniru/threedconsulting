import type { ReactNode } from "react";

type IllustrationProps = {
  className?: string;
  title?: string;
};

function Illustration({
  children,
  className,
  title,
}: IllustrationProps & {
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function RocketIllustration({
  className,
  title = "Rocket",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <path
        d="M60 12c16 10 24 28 22 52l-10 10H48l-10-10C36 40 44 22 60 12z"
        fill="#38bdf8"
      />
      <path d="M60 12c16 10 24 28 22 52H60z" fill="#0ea5e9" />
      <circle cx="60" cy="46" r="12" fill="#fff8ee" />
      <circle cx="60" cy="46" r="6" fill="#fccf3f" />
      <path d="M38 66 24 80l4 12 16-14z" fill="#ff7a59" />
      <path d="m82 66 14 14-4 12-16-14z" fill="#ff7a59" />
      <path d="M52 90h16l-4 16-4 8-4-8z" fill="#fccf3f" />
    </Illustration>
  );
}

export function BookIllustration({
  className,
  title = "Book",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <rect x="18" y="26" width="84" height="68" rx="8" fill="#4ade80" />
      <rect x="24" y="32" width="34" height="56" rx="4" fill="#fff8ee" />
      <rect x="62" y="32" width="34" height="56" rx="4" fill="#fff" />
      <path d="M60 30v62" stroke="#16a34a" strokeWidth="4" />
      <rect x="30" y="42" width="22" height="4" rx="2" fill="#86efac" />
      <rect x="30" y="52" width="18" height="4" rx="2" fill="#86efac" />
      <rect x="68" y="42" width="22" height="4" rx="2" fill="#bbf7d0" />
      <rect x="68" y="52" width="18" height="4" rx="2" fill="#bbf7d0" />
    </Illustration>
  );
}

export function StarIllustration({ className, title }: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <path
        d="m60 16 12 26 28 3-21 19 6 28-25-14-25 14 6-28-21-19 28-3z"
        fill="#fccf3f"
        stroke="#f5b719"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Illustration>
  );
}

export function RainbowIllustration({
  className,
  title = "Rainbow",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <path d="M18 82a42 42 0 0 1 84 0H90a30 30 0 0 0-60 0z" fill="#ff7a59" />
      <path d="M30 82a30 30 0 0 1 60 0H78a18 18 0 0 0-36 0z" fill="#fccf3f" />
      <path d="M42 82a18 18 0 0 1 36 0H66a6 6 0 0 0-12 0z" fill="#38bdf8" />
      <circle cx="22" cy="90" r="9" fill="#fff" />
      <circle cx="98" cy="90" r="9" fill="#fff" />
    </Illustration>
  );
}

export function PuzzleIllustration({
  className,
  title = "Puzzle piece",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <path
        d="M40 24h18a8 8 0 1 1 16 0h6a4 4 0 0 1 4 4v18a8 8 0 1 0 0 16v18a4 4 0 0 1-4 4H62a8 8 0 1 0-16 0H28a4 4 0 0 1-4-4V62a8 8 0 1 0 0-16V28a4 4 0 0 1 4-4z"
        fill="#a78bfa"
      />
    </Illustration>
  );
}

export function LightbulbIllustration({
  className,
  title = "Idea lightbulb",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <circle cx="60" cy="50" r="30" fill="#fccf3f" />
      <path d="M48 70h24v10a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6z" fill="#e0e7ef" />
      <rect x="50" y="88" width="20" height="6" rx="3" fill="#9ca3af" />
      <rect x="52" y="98" width="16" height="6" rx="3" fill="#9ca3af" />
      <path
        d="M60 34v22M50 44l10 8 10-8"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Illustration>
  );
}

export function CalculatorIllustration({
  className,
  title = "Mathematics",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <rect x="26" y="18" width="68" height="84" rx="12" fill="#38bdf8" />

      <rect x="36" y="28" width="48" height="20" rx="5" fill="#fff8ee" />

      <g fill="#fff">
        <circle cx="44" cy="62" r="6" />
        <circle cx="60" cy="62" r="6" />
        <circle cx="76" cy="62" r="6" />
        <circle cx="44" cy="80" r="6" />
        <circle cx="60" cy="80" r="6" />
      </g>

      <rect x="70" y="74" width="12" height="18" rx="6" fill="#fccf3f" />
    </Illustration>
  );
}

export function RobotIllustration({
  className,
  title = "Coding and robotics",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <rect x="34" y="40" width="52" height="46" rx="12" fill="#2dd4bf" />

      <circle cx="50" cy="60" r="7" fill="#fff" />
      <circle cx="70" cy="60" r="7" fill="#fff" />
      <circle cx="50" cy="60" r="3" fill="#0f766e" />
      <circle cx="70" cy="60" r="3" fill="#0f766e" />

      <rect x="48" y="74" width="24" height="6" rx="3" fill="#0d9488" />

      <rect x="56" y="24" width="8" height="12" rx="4" fill="#0d9488" />

      <circle cx="60" cy="22" r="5" fill="#fccf3f" />

      <rect x="22" y="52" width="10" height="24" rx="5" fill="#14b8a6" />

      <rect x="88" y="52" width="10" height="24" rx="5" fill="#14b8a6" />
    </Illustration>
  );
}

export function PencilIllustration({
  className,
  title = "Writing pencil",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <rect
        x="52"
        y="16"
        width="16"
        height="70"
        rx="6"
        fill="#fccf3f"
        transform="rotate(20 60 50)"
      />

      <path d="m74 92-14 6 4-15z" fill="#3a3f4b" />

      <rect
        x="52"
        y="16"
        width="16"
        height="14"
        rx="6"
        fill="#ff7a59"
        transform="rotate(20 60 50)"
      />
    </Illustration>
  );
}

export function AtomIllustration({
  className,
  title = "Science atom",
}: IllustrationProps) {
  return (
    <Illustration className={className} title={title}>
      <ellipse
        cx="60"
        cy="60"
        rx="42"
        ry="18"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="5"
      />

      <ellipse
        cx="60"
        cy="60"
        rx="42"
        ry="18"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="5"
        transform="rotate(60 60 60)"
      />

      <ellipse
        cx="60"
        cy="60"
        rx="42"
        ry="18"
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="5"
        transform="rotate(120 60 60)"
      />

      <circle cx="60" cy="60" r="9" fill="#ff7a59" />
    </Illustration>
  );
}

export function CloudIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 96 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M27.5 61C16.73 61 8 52.27 8 41.5S16.73 22 27.5 22c2.2 0 4.32.37 6.29 1.05C38.3 13.5 48.01 7 59.25 7 74.58 7 87 19.42 87 34.75c0 1.3-.09 2.57-.26 3.82A12.5 12.5 0 0 1 83.5 63h-56Z"
        fill="#FFFFFF"
      />

      <path
        d="M27.5 61C16.73 61 8 52.27 8 41.5S16.73 22 27.5 22c2.2 0 4.32.37 6.29 1.05C38.3 13.5 48.01 7 59.25 7 74.58 7 87 19.42 87 34.75c0 1.3-.09 2.57-.26 3.82A12.5 12.5 0 0 1 83.5 63h-56Z"
        stroke="#BAE6FD"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="39" cy="39" r="3" fill="#38BDF8" />

      <circle cx="59" cy="39" r="3" fill="#38BDF8" />

      <path
        d="M42 49c4 3 10 3 14 0"
        stroke="#38BDF8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MusicIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path
        d="M50 30 90 22v46"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <circle cx="44" cy="78" r="12" fill="#a78bfa" />

      <circle cx="84" cy="70" r="12" fill="#8b5cf6" />

      <circle cx="44" cy="78" r="5" fill="#fff8ee" />
    </svg>
  );
}

export function MicrophoneIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <rect x="48" y="20" width="24" height="46" rx="12" fill="#ff7a59" />

      <path
        d="M36 56a24 24 0 0 0 48 0"
        fill="none"
        stroke="#f85e38"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <rect x="56" y="80" width="8" height="18" rx="4" fill="#9ca3af" />

      <rect x="44" y="98" width="32" height="8" rx="4" fill="#9ca3af" />
    </svg>
  );
}

export function PaintIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path
        d="M60 22c26 0 42 16 42 34 0 12-10 16-20 16-8 0-10 6-6 12 4 8-2 12-16 12-24 0-42-18-42-42s16-32 42-32Z"
        fill="#fff8ee"
        stroke="#e5e7eb"
        strokeWidth="3"
      />

      <circle cx="42" cy="48" r="7" fill="#ff7a59" />
      <circle cx="62" cy="40" r="7" fill="#38bdf8" />
      <circle cx="80" cy="52" r="7" fill="#4ade80" />
      <circle cx="44" cy="72" r="7" fill="#fccf3f" />
    </svg>
  );
}

export function GraduationCapIllustration({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path d="m60 30 46 20-46 20-46-20Z" fill="#8b5cf6" />

      <path
        d="m60 54 30-13v22c0 8-13 15-30 15s-30-7-30-15V41Z"
        fill="#a78bfa"
      />

      <rect x="102" y="48" width="4" height="26" rx="2" fill="#6d28d9" />

      <circle cx="104" cy="76" r="6" fill="#fccf3f" />
    </svg>
  );
}

