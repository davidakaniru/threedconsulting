import Image from "next/image";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  PlatformAccent,
  PlatformDashboard,
  PlatformTone,
} from "@/data/platform";
import { cn } from "@/lib/utils";

const accentStyles: Record<
  PlatformAccent,
  {
    solid: string;
    soft: string;
    text: string;
    bar: string;
  }
> = {
  sky: {
    solid: "bg-[#38bdf8]",
    soft: "bg-[#e0f2fe]",
    text: "text-[#0284c7]",
    bar: "bg-[#38bdf8]",
  },
  teal: {
    solid: "bg-[#2dd4bf]",
    soft: "bg-[#ccfbf1]",
    text: "text-[#0d9488]",
    bar: "bg-[#2dd4bf]",
  },
  grape: {
    solid: "bg-[#a78bfa]",
    soft: "bg-[#ede9fe]",
    text: "text-[#7c3aed]",
    bar: "bg-[#a78bfa]",
  },
};

const tonePillStyles: Record<PlatformTone, string> = {
  grass: "bg-[#dcfce7] text-[#15803d]",
  sun: "bg-[#fef3c7] text-[#a16207]",
  coral: "bg-[#ffe4d9] text-[#c24122]",
  sky: "bg-[#e0f2fe] text-[#0369a1]",
  grape: "bg-[#ede9fe] text-[#6d28d9]",
  teal: "bg-[#ccfbf1] text-[#0f766e]",
};

const toneIconStyles: Record<PlatformTone, string> = {
  grass: "bg-[#dcfce7] text-[#16a34a]",
  sun: "bg-[#fef3c7] text-[#ca8a04]",
  coral: "bg-[#ffe4d9] text-[#f85e38]",
  sky: "bg-[#e0f2fe] text-[#0284c7]",
  grape: "bg-[#ede9fe] text-[#7c3aed]",
  teal: "bg-[#ccfbf1] text-[#0d9488]",
};

const progressStyles: Record<PlatformTone, string> = {
  grass: "bg-[#4ade80]",
  sun: "bg-[#fccf3f]",
  coral: "bg-[#ff7a59]",
  sky: "bg-[#38bdf8]",
  grape: "bg-[#a78bfa]",
  teal: "bg-[#2dd4bf]",
};

function getIcon(iconName: string): LucideIcon {
  return (
    (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? Icons.Circle
  );
}

export function DashboardMock({
  role,
  accent,
  nav,
  greeting,
  stats,
  panelTitle,
  panelRows,
  progress,
}: PlatformDashboard) {
  const accentStyle = accentStyles[accent];

  return (
    <div
      className="overflow-hidden rounded-3xl border border-sky-50
        bg-white shadow-[0_24px_60px_-24px_rgba(56,116,189,0.45)]"
    >
      <div
        className="flex items-center gap-1.5 border-b border-sky-50
          bg-[#fff8ee]/60 px-4 py-3"
      >
        <span aria-hidden="true" className="size-3 rounded-full bg-[#ffab96]" />

        <span aria-hidden="true" className="size-3 rounded-full bg-[#fddc7a]" />

        <span aria-hidden="true" className="size-3 rounded-full bg-[#86efac]" />

        <span
          className="ml-3 truncate text-xs font-semibold
            text-muted-foreground"
        >
          {role} · ThreeD Platform
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[180px_1fr]">
        <aside
          className={cn(
            "space-y-1 border-r border-sky-50 p-3",
            accentStyle.soft,
          )}
        >
          <div className="hidden items-center gap-2 px-2 py-2 sm:flex">
            <span className="relative size-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src="/brand/threed-consulting.jpeg"
                alt=""
                fill
                sizes="32px"
                className="object-contain"
              />
            </span>

            <span
              className="truncate font-display text-sm font-bold
                text-foreground"
            >
              {role}
            </span>
          </div>

          {nav.map((item, index) => {
            const Icon = getIcon(item.icon);

            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2 py-2 text-sm",
                  index === 0
                    ? cn("bg-white font-bold shadow-sm", accentStyle.text)
                    : "text-muted-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />

                <span className="hidden truncate sm:block">{item.label}</span>
              </div>
            );
          })}
        </aside>

        <div className="bg-[#fffdf8] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                className="truncate font-display text-lg font-extrabold
                  leading-tight text-foreground"
              >
                {greeting}
              </p>

              <p className="text-xs text-muted-foreground">
                Here’s what’s happening today
              </p>
            </div>

            <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src="/brand/threed-consulting.jpeg"
                alt=""
                fill
                sizes="36px"
                className="object-contain"
              />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = getIcon(stat.icon);

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-sky-50
                    bg-white p-3 shadow-sm"
                >
                  <span
                    className={cn(
                      "mb-2 grid size-8 place-items-center rounded-lg",
                      toneIconStyles[stat.tone],
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>

                  <p
                    className="font-display text-lg font-extrabold
                      leading-none text-foreground"
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div
              className="rounded-2xl border border-sky-50
                bg-white p-4 shadow-sm"
            >
              <p
                className="mb-3 font-display text-sm font-bold
                  text-foreground"
              >
                {panelTitle}
              </p>

              <div className="space-y-2.5">
                {panelRows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-7 shrink-0 rounded-full",
                          accentStyle.bar,
                        )}
                      />

                      <div className="min-w-0">
                        <p
                          className="truncate text-xs font-bold
                            text-foreground"
                        >
                          {row.name}
                        </p>

                        <p
                          className="truncate text-[10px]
                            text-muted-foreground"
                        >
                          {row.meta}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5",
                        "text-[10px] font-bold",
                        tonePillStyles[row.tone],
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border border-sky-50
                bg-white p-4 shadow-sm"
            >
              <p
                className="mb-3 font-display text-sm font-bold
                  text-foreground"
              >
                Progress
              </p>

              <div className="space-y-3">
                {progress.map((item) => (
                  <div key={item.label}>
                    <div
                      className="mb-1 flex justify-between gap-3
                        text-[11px]"
                    >
                      <span
                        className="truncate font-semibold
                          text-muted-foreground"
                      >
                        {item.label}
                      </span>

                      <span className="shrink-0 text-muted-foreground">
                        {item.value}%
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full
                        bg-sky-50"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          progressStyles[item.tone],
                        )}
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
