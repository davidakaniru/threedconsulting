import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  AdminPage,
  InfoCard,
  PageBackButton,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { getTutorApplication } from "@/modules/tutor-applications/server/admin-tutor-application.service";
import { TutorApplicationDetailActions } from "@/modules/tutor-applications/components/tutor-application-detail-actions";
import Image from "next/image";

export const metadata: Metadata = { title: "Tutor Application | Admin Portal" };

type Props = { params: Promise<{ id: string }> };

export default async function TutorApplicationPage({ params }: Props) {
  const { id } = await params;
  const application = await getTutorApplication(id);
  const fullName = `${application.firstName} ${application.lastName}`.trim();

  return (
    <AdminPage>
      <PageBackButton label="Back to tutor applications" />
      <PageHeader
        eyebrow="Tutor application"
        title={fullName}
        description="Review the applicant's personal and professional information before making a decision."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="size-28 shrink-0 overflow-hidden rounded-2xl bg-slate-900">
                {application.profileImageUrl ? (
                  <Image
                    src={application.profileImageUrl}
                    width={112}
                    height={112}
                    alt={`${fullName} profile`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-2xl font-extrabold text-slate-400">
                    {application.firstName[0]}
                    {application.lastName[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-extrabold text-slate-900">
                    {fullName}
                  </h2>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-ellipsis line-clamp-1">
                    <Mail className="size-4" />
                    {application.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4" />
                    {application.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    }).format(new Date(`${application.dateOfBirth}T00:00:00`))}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {application.city}, {application.country}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              About the applicant
            </h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
              {application.summary}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <InfoCard
              icon={FileText}
              title="Areas of expertise"
              description={application.expertise}
            />
            <InfoCard
              icon={FileText}
              title="Qualifications"
              description={application.qualifications}
            />
          </section>

          <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              Address
            </h2>
            <p className="mt-3 text-slate-600">
              {application.addressLine1}
              <br />
              {application.city}
              <br />
              {application.country}
            </p>
          </section>

          {application.status === "pending" ||
          application.status === "reviewing" ? (
            <TutorApplicationDetailActions
              applicationId={application.id}
              applicantName={fullName}
              email={application.email}
            />
          ) : null}
        </div>

        <aside className="space-y-4">
          {application.cvUrl && (
            <Link
              href={application.cvUrl}
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <Download className="size-5 text-primary" />
                <span>
                  <span className="block font-extrabold text-slate-900">
                    View CV
                  </span>
                  <span className="text-xs text-slate-500">PDF document</span>
                </span>
              </span>
              <ArrowLeft className="size-4 rotate-180 text-slate-400" />
            </Link>
          )}
        </aside>
      </div>
    </AdminPage>
  );
}
