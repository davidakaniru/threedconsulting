"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, BookPlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/api/errors";
import {
  uploadProgrammeCover,
  useCreateProgramme,
  useUpdateProgramme,
} from "@/modules/programmes/hooks";
import {
  createProgrammeSchema,
  type CreateProgrammeRequest,
} from "@/modules/programmes/schemas";
import type {
  ProgrammeDetail,
  ProgrammeStatus,
} from "@/modules/programmes/types";
import Image from "next/image";

export function ProgrammeForm({ programme }: { programme?: ProgrammeDetail }) {
  const router = useRouter();
  const create = useCreateProgramme();
  const update = useUpdateProgramme(programme?.id ?? "");
  const mutation = programme ? update : create;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProgrammeRequest>({
    resolver: yupResolver(createProgrammeSchema),
    mode: "onTouched",
    defaultValues: {
      title: programme?.title ?? "",
      slug: programme?.slug ?? "",
      description: programme?.description ?? "",
      coverImageUrl: programme?.coverImageUrl ?? "",
      overview: programme?.overview ?? "",
      outcomes: (programme?.outcomes?.length
        ? programme.outcomes
        : [""]) as string[],
      status: programme?.status ?? "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outcomes",
  });
  const coverImageUrl = watch("coverImageUrl");
  const coverImageFiles = watch("coverImage");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>(
    programme?.coverImageUrl ?? "",
  );

  useEffect(() => {
    const file = coverImageFiles?.[0];
    if (!file) {
      setCoverPreviewUrl(coverImageUrl ?? programme?.coverImageUrl ?? "");
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImageFiles, coverImageUrl, programme?.coverImageUrl]);

  const save = (status: ProgrammeStatus) =>
    handleSubmit(async (values) => {
      try {
        const file = values.coverImage?.[0];
        if (file) {
          const url = await uploadProgrammeCover(file);
          setValue("coverImageUrl", url, { shouldValidate: true });
          values.coverImageUrl = url;
        }
        const { coverImage: _coverImage, ...payload } = values;
        void _coverImage;
        const saved = await mutation.mutateAsync({
          ...payload,
          status: programme ? values.status : status,
        } as CreateProgrammeRequest);
        toast.success(
          programme
            ? "Subject updated."
            : status === "draft"
              ? "Subject saved as draft."
              : "Subject published.",
        );
        router.push(`/portal/admin/programmes/${saved.id}`);
      } catch (e) {
        toast.error(toApiError(e).message);
      }
    });

  return (
    <form
      onSubmit={programme ? save(programme.status) : save("published")}
      noValidate
      className="space-y-6"
    >
      <div className="grid gap-5">
        <Input
          id="title"
          label="Subject title"
          required
          placeholder="e.g. Mathematics"
          errorMessage={errors.title?.message}
          {...register("title")}
        />
        <Input
          id="slug"
          label="Slug"
          required
          placeholder="e.g. mathematics"
          info="Used in subject URLs. Use lowercase letters, numbers and hyphens."
          errorMessage={errors.slug?.message}
          {...register("slug")}
        />
        <Textarea
          id="description"
          label="Description"
          required
          rows={4}
          placeholder="A concise description of the subject..."
          errorMessage={errors.description?.message}
          {...register("description")}
        />
        <div className="grid gap-2">
          <label
            htmlFor="coverImage"
            className="font-display text-sm font-bold text-foreground"
          >
            Cover image <span className="ml-1 text-coral">*</span>
          </label>
          <Input
            id="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            info="JPG, PNG or WebP. Maximum 5 MB."
            errorMessage={errors.coverImage?.message as string | undefined}
            {...register("coverImage")}
          />
          {coverPreviewUrl && (
            <div className="overflow-hidden rounded-2xl border bg-muted/20">
              <Image
                src={coverPreviewUrl}
                alt="Subject cover preview"
                width={640}
                height={280}
                priority
                quality={80}
                className="aspect-16/7 w-full object-cover"
              />
            </div>
          )}
        </div>
        <Textarea
          id="overview"
          label="Overview"
          required
          rows={7}
          placeholder="Provide a fuller overview of the subject..."
          errorMessage={errors.overview?.message}
          {...register("overview")}
        />
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">
              Learning outcomes
            </h3>
            <p className="text-xs text-muted-foreground">
              Add the key outcomes learners should achieve.
            </p>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                id={`outcomes-${index}`}
                label={index === 0 ? "Outcome" : undefined}
                errorMessage={errors.outcomes?.[index]?.message}
                {...register(`outcomes.${index}` as const)}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="mt-0 shrink-0 self-end"
                  onClick={() => remove(index)}
                  aria-label={`Remove outcome ${index + 1}`}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => append("")}>
            <Plus /> Add outcome
          </Button>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link
            href={
              programme
                ? `/portal/admin/programmes/${programme.id}`
                : "/portal/admin/programmes"
            }
          >
            <ArrowLeft /> Cancel
          </Link>
        </Button>
        {programme ? (
          <Button type="submit" disabled={mutation.isPending}>
            <Save />
            {mutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => void save("draft")()}
            >
              <Save />
              {mutation.isPending ? "Saving..." : "Save as draft"}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              <BookPlus />
              {mutation.isPending ? "Publishing..." : "Create subject"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
