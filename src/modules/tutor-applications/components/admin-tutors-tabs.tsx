"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TeachersTable } from "@/modules/teachers";
import { TutorApplicationsTable } from "./tutor-applications-table";

type Tab = "active" | "applications";

const tabs: Array<{ id: Tab; label: string; href: string }> = [
  {
    id: "active",
    label: "Active Teachers",
    href: "/portal/admin/teachers",
  },
  {
    id: "applications",
    label: "Teacher Applications",
    href: "/portal/admin/teachers/applications",
  },
];

export function AdminTutorsTabs() {
  const pathname = usePathname();
  const tab: Tab = pathname.startsWith("/portal/admin/teachers/applications")
    ? "applications"
    : "active";

  return (
    <div className="space-y-6">
      <div
        className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
        role="tablist"
        aria-label="Teacher management"
      >
        {tabs.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            role="tab"
            aria-selected={tab === item.id}
            aria-current={tab === item.id ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              tab === item.id
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {tab === "active" ? (
        <div id="active-teachers-panel" role="tabpanel">
          <TeachersTable />
        </div>
      ) : (
        <div id="teacher-applications-panel" role="tabpanel">
          <TutorApplicationsTable />
        </div>
      )}
    </div>
  );
}
