import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import type { LessonReviewRequest } from "@/modules/lesson-reviews/schemas";
import type {
  LessonReview,
  LessonReviewAdminView,
  ParentReviewContext,
} from "@/modules/lesson-reviews/types";

const db = () => createAdminClient() as any;

type ReviewRow = Database["public"]["Tables"]["lesson_reviews"]["Row"];
type ProgrammeRow = Database["public"]["Tables"]["programmes"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type TeacherRow = Database["public"]["Tables"]["teachers"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// lesson_assignments exists in the reconciled Supabase schema, but the generated
// Database type in this project does not currently expose it under Tables.
// Keep this feature's row shape local until the generated database types are
// regenerated from the current production schema.
type AssignmentIdRow = { id: string };

type AssignmentRow = {
  id: string;
  parent_id: string;
  start_date: string;
  end_date: string;
  status: string;
  programme_id: string;
  student_id: string;
  teacher_id: string;
};

type MaybeRelation<T> = T | T[] | null;

type ParentAssignment = Pick<
  AssignmentRow,
  "id" | "parent_id" | "start_date" | "end_date" | "status" | "programme_id" | "student_id" | "teacher_id"
> & {
  programmes: MaybeRelation<Pick<ProgrammeRow, "id" | "name">>;
  students: MaybeRelation<Pick<StudentRow, "first_name" | "last_name">>;
  teachers: MaybeRelation<
    Pick<TeacherRow, "id"> & {
      profiles: MaybeRelation<Pick<ProfileRow, "first_name" | "last_name" | "email">>;
    }
  >;
};

export type ParentReviewState = {
  assignmentId: string;
  eligible: boolean;
  reviewId: string | null;
};

type AdminReviewRow = ReviewRow & {
  lesson_assignments: MaybeRelation<
    Pick<
      AssignmentRow,
      | "id"
      | "teacher_id"
      | "student_id"
      | "parent_id"
      | "programme_id"
      | "start_date"
      | "end_date"
    > & {
      programmes: MaybeRelation<Pick<ProgrammeRow, "id" | "name">>;
      students: MaybeRelation<Pick<StudentRow, "first_name" | "last_name">>;
      teachers: MaybeRelation<
        Pick<TeacherRow, "id"> & {
          profiles: MaybeRelation<Pick<ProfileRow, "first_name" | "last_name" | "email">>;
        }
      >;
      parents: MaybeRelation<{
        profiles: MaybeRelation<Pick<ProfileRow, "first_name" | "last_name" | "email">>;
      }>;
    }
  >;
};

function one<T>(value: MaybeRelation<T> | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function mapReview(row: ReviewRow): LessonReview {
  return {
    id: row.id,
    lessonAssignmentId: row.lesson_assignment_id,
    parentId: row.parent_id,
    rating: row.rating,
    lessonOutcome: row.lesson_outcome,
    teacherFeedback: row.teacher_feedback,
    wouldRecommend: row.would_recommend,
    additionalComments: row.additional_comments,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function parentAssignment(
  parentId: string,
  assignmentId: string,
): Promise<ParentAssignment> {
  const { data, error } = await db()
    .from("lesson_assignments")
    .select(
      "id,parent_id,start_date,end_date,status,programme_id,student_id,teacher_id,programmes(id,name),students(first_name,last_name),teachers(id,profiles(first_name,last_name,email))",
    )
    .eq("id", assignmentId)
    .eq("parent_id", parentId)
    .maybeSingle();

  if (error)
    throw new ApiError(
      "LESSON_REVIEW_CONTEXT_FAILED",
      "The lesson could not be loaded for feedback.",
      500,
    );
  if (!data)
    throw new ApiError(
      "LESSON_REVIEW_FORBIDDEN",
      "You can only review lessons linked to your parent account.",
      403,
    );

  return data as ParentAssignment;
}

async function completedSessionCount(assignmentId: string) {
  const { count, error } = await db()
    .from("class_sessions")
    .select("id", { count: "exact", head: true })
    .eq("lesson_assignment_id", assignmentId)
    .eq("status", "completed");

  if (error)
    throw new ApiError(
      "LESSON_REVIEW_ELIGIBILITY_FAILED",
      "Review eligibility could not be checked.",
      500,
    );

  return count ?? 0;
}

export async function listParentReviewStates(
  parentId: string,
): Promise<ParentReviewState[]> {
  const { data: assignments, error } = await db()
    .from("lesson_assignments")
    .select("id")
    .eq("parent_id", parentId);

  if (error)
    throw new ApiError(
      "LESSON_REVIEW_STATES_FAILED",
      "Lesson feedback status could not be loaded.",
      500,
    );

  const assignmentRows = (assignments ?? []) as AssignmentIdRow[];
  const ids = assignmentRows.map((item) => item.id);
  if (!ids.length) return [];

  const [{ data: reviews, error: reviewError }, { data: completed, error: sessionError }] =
    await Promise.all([
      db()
        .from("lesson_reviews")
        .select("id,lesson_assignment_id")
        .eq("parent_id", parentId)
        .in("lesson_assignment_id", ids),
      db()
        .from("class_sessions")
        .select("lesson_assignment_id")
        .in("lesson_assignment_id", ids)
        .eq("status", "completed"),
    ]);

  if (reviewError || sessionError)
    throw new ApiError(
      "LESSON_REVIEW_STATES_FAILED",
      "Lesson feedback status could not be loaded.",
      500,
    );

  const reviewRows = (reviews ?? []) as Array<Pick<ReviewRow, "id" | "lesson_assignment_id">>;
  const reviewByAssignment = new Map<string, string>();
  for (const item of reviewRows) {
    reviewByAssignment.set(item.lesson_assignment_id, item.id);
  }

  const completedRows = (completed ?? []) as Array<Pick<
    Database["public"]["Tables"]["class_sessions"]["Row"],
    "lesson_assignment_id"
  >>;
  const completedAssignments = new Set<string>();
  for (const item of completedRows) {
    if (item.lesson_assignment_id) {
      completedAssignments.add(item.lesson_assignment_id);
    }
  }

  return ids.map((assignmentId) => ({
    assignmentId,
    eligible: completedAssignments.has(assignmentId),
    reviewId: reviewByAssignment.get(assignmentId) ?? null,
  }));
}

export async function getParentReviewContext(
  parentId: string,
  assignmentId: string,
): Promise<ParentReviewContext> {
  const assignment = await parentAssignment(parentId, assignmentId);
  const [completedSessions, reviewResult] = await Promise.all([
    completedSessionCount(assignmentId),
    db()
      .from("lesson_reviews")
      .select("*")
      .eq("lesson_assignment_id", assignmentId)
      .eq("parent_id", parentId)
      .maybeSingle(),
  ]);

  if (reviewResult.error)
    throw new ApiError(
      "LESSON_REVIEW_LOAD_FAILED",
      "Your feedback could not be loaded.",
      500,
    );

  const programme = one(assignment.programmes);
  const student = one(assignment.students);
  const teacher = one(assignment.teachers);
  const teacherProfile = one(teacher?.profiles);

  return {
    assignmentId,
    childName:
      [student?.first_name, student?.last_name].filter(Boolean).join(" ") ||
      "Child",
    teacherName:
      [teacherProfile?.first_name, teacherProfile?.last_name]
        .filter(Boolean)
        .join(" ") || "Tutor",
    programmeName: programme?.name || "Subject",
    completedSessions,
    eligible: completedSessions > 0,
    review: reviewResult.data ? mapReview(reviewResult.data) : null,
  };
}

export async function saveParentLessonReview(
  parentId: string,
  assignmentId: string,
  input: LessonReviewRequest,
): Promise<LessonReview> {
  await parentAssignment(parentId, assignmentId);
  const completedSessions = await completedSessionCount(assignmentId);

  const { data: existing, error: existingError } = await db()
    .from("lesson_reviews")
    .select("id")
    .eq("lesson_assignment_id", assignmentId)
    .eq("parent_id", parentId)
    .maybeSingle();

  if (existingError)
    throw new ApiError(
      "LESSON_REVIEW_SAVE_FAILED",
      "Your feedback could not be saved.",
      500,
    );

  if (completedSessions < 1 && !existing)
    throw new ApiError(
      "LESSON_REVIEW_NOT_ELIGIBLE",
      "Feedback becomes available after the first completed session.",
      409,
    );

  const values = {
    rating: input.rating,
    lesson_outcome: input.lessonOutcome.trim(),
    teacher_feedback: input.teacherFeedback.trim(),
    would_recommend: input.wouldRecommend,
    additional_comments: input.additionalComments?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const result = existing
    ? await db()
        .from("lesson_reviews")
        .update(values)
        .eq("id", existing.id)
        .select("*")
        .single()
    : await db()
        .from("lesson_reviews")
        .insert({
          lesson_assignment_id: assignmentId,
          parent_id: parentId,
          ...values,
        })
        .select("*")
        .single();

  if (result.error || !result.data)
    throw new ApiError(
      "LESSON_REVIEW_SAVE_FAILED",
      "Your feedback could not be saved.",
      500,
    );

  return mapReview(result.data);
}

function mapAdminReview(row: AdminReviewRow): LessonReviewAdminView {
  const assignment = one(row.lesson_assignments);
  const programme = one(assignment?.programmes);
  const student = one(assignment?.students);
  const teacher = one(assignment?.teachers);
  const teacherProfile = one(teacher?.profiles);
  const parent = one(assignment?.parents);
  const parentProfile = one(parent?.profiles);

  return {
    ...mapReview(row),
    parentName:
      [parentProfile?.first_name, parentProfile?.last_name]
        .filter(Boolean)
        .join(" ") || "Parent",
    parentEmail: parentProfile?.email || "",
    childName:
      [student?.first_name, student?.last_name].filter(Boolean).join(" ") ||
      "Child",
    teacherId: teacher?.id || assignment?.teacher_id || "",
    teacherName:
      [teacherProfile?.first_name, teacherProfile?.last_name]
        .filter(Boolean)
        .join(" ") || "Tutor",
    teacherEmail: teacherProfile?.email || "",
    programmeId: programme?.id || assignment?.programme_id || "",
    programmeName: programme?.name || "Subject",
    assignmentStartDate: assignment?.start_date || "",
    assignmentEndDate: assignment?.end_date || "",
  };
}

const ADMIN_SELECT =
  "*,lesson_assignments!inner(id,teacher_id,student_id,parent_id,programme_id,start_date,end_date,programmes(id,name),students(first_name,last_name),teachers(id,profiles(first_name,last_name,email)),parents(profiles(first_name,last_name,email)))";

export async function listAdminLessonReviews(filters?: {
  teacherId?: string;
  programmeId?: string;
  rating?: number;
  from?: string;
  to?: string;
}): Promise<LessonReviewAdminView[]> {
  const { data, error } = await db()
    .from("lesson_reviews")
    .select(ADMIN_SELECT)
    .order("created_at", { ascending: false });

  if (error)
    throw new ApiError(
      "LESSON_REVIEWS_LOAD_FAILED",
      "Reviews could not be loaded.",
      500,
    );

  const rows = (data ?? []) as unknown as AdminReviewRow[];

  return rows
    .map((row) => mapAdminReview(row))
    .filter((review) => {
      if (filters?.teacherId && review.teacherId !== filters.teacherId)
        return false;
      if (filters?.programmeId && review.programmeId !== filters.programmeId)
        return false;
      if (filters?.rating && review.rating !== filters.rating) return false;
      if (filters?.from && review.createdAt.slice(0, 10) < filters.from)
        return false;
      if (filters?.to && review.createdAt.slice(0, 10) > filters.to)
        return false;
      return true;
    });
}

export async function getAdminLessonReview(
  id: string,
): Promise<LessonReviewAdminView> {
  const { data, error } = await db()
    .from("lesson_reviews")
    .select(ADMIN_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error)
    throw new ApiError(
      "LESSON_REVIEW_LOAD_FAILED",
      "The review could not be loaded.",
      500,
    );
  if (!data)
    throw new ApiError("LESSON_REVIEW_NOT_FOUND", "Review not found.", 404);

  return mapAdminReview(data as unknown as AdminReviewRow);
}

export async function getLessonReviewFilterOptions() {
  const reviews = await listAdminLessonReviews();

  const teacherMap = new Map<string, string>();
  const programmeMap = new Map<string, string>();

  for (const review of reviews) {
    if (review.teacherId) teacherMap.set(review.teacherId, review.teacherName);
    if (review.programmeId)
      programmeMap.set(review.programmeId, review.programmeName);
  }

  return {
    teachers: [...teacherMap.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    programmes: [...programmeMap.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}
