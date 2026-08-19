"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ComboboxField } from "@/components/forms/combobox-field";
import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SelectOption } from "@/types/form";

const ratingOptions = [
  { value: "all", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

export function AdminReviewFilters({
  teachers,
  programmes,
  initial,
}: {
  teachers: SelectOption[];
  programmes: SelectOption[];
  initial: {
    teacherId?: string;
    programmeId?: string;
    rating?: string;
    from?: string;
    to?: string;
  };
}) {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState(initial.teacherId ?? "");
  const [programmeId, setProgrammeId] = useState(initial.programmeId ?? "");
  const [rating, setRating] = useState(initial.rating ?? "all");
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (teacherId) params.set("teacherId", teacherId);
    if (programmeId) params.set("programmeId", programmeId);
    if (rating !== "all") params.set("rating", rating);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    router.push(`/portal/admin/reviews${query ? `?${query}` : ""}`);
  }

  function clear() {
    setTeacherId("");
    setProgrammeId("");
    setRating("all");
    setFrom("");
    setTo("");
    router.push("/portal/admin/reviews");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
      <ComboboxField
        label="Teacher"
        options={teachers}
        value={teacherId}
        onValueChange={setTeacherId}
        placeholder="All teachers"
        searchPlaceholder="Search teachers..."
        emptyText="No teacher found."
      />
      <ComboboxField
        label="Programme"
        options={programmes}
        value={programmeId}
        onValueChange={setProgrammeId}
        placeholder="All programmes"
        searchPlaceholder="Search programmes..."
        emptyText="No programme found."
      />
      <SelectField
        id="review-rating"
        label="Rating"
        options={ratingOptions}
        value={rating}
        onValueChange={setRating}
      />
      <Input
        id="review-from"
        label="From"
        type="date"
        value={from}
        onChange={(event) => setFrom(event.target.value)}
      />
      <Input
        id="review-to"
        label="To"
        type="date"
        value={to}
        onChange={(event) => setTo(event.target.value)}
      />
      <div className="flex gap-2 lg:col-span-2 xl:col-span-5">
        <Button type="button" onClick={apply}>
          Apply filters
        </Button>
        <Button type="button" variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
