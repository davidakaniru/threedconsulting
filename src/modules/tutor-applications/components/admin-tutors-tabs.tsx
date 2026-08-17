"use client";

import { useState } from "react";
import { AdminTutorApplications } from "./admin-tutor-applications";
import type { AdminTutorApplication } from "@/modules/tutor-applications/types";
import { TeachersTable } from "@/modules/teachers";

export function AdminTutorsTabs({ applications }: { applications: AdminTutorApplication[] }) {
  const [tab, setTab] = useState<"applications" | "active">("applications");

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Tutor management">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "applications"}
          onClick={() => setTab("applications")}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === "applications" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
        >
          Tutor Applications
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "active"}
          onClick={() => setTab("active")}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === "active" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
        >
          Active Tutors
        </button>
      </div>

      {tab === "applications" ? <AdminTutorApplications applications={applications} /> : <TeachersTable />}
    </div>
  );
}
