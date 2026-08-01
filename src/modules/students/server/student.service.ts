import { ApiError } from "@/lib/api/errors";
import { normalizePagination } from "@/lib/modules";
import { nullableText } from "@/lib/mappers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudentParents } from "@/modules/parents/server";
import type {
  CreateStudentRequest,
  UpdateStudentRequest,
} from "@/modules/students/schemas";
import type {
  StudentDetail,
  StudentListResult,
  StudentMetricsI,
} from "@/modules/students/types";
import {
  mapStudentDetail,
  mapStudentSummary,
  type StudentRow,
} from "@/modules/students/server/student.mapper";
import {
  getStudentCount,
  getStudentRow,
  insertStudent,
  listStudentRows,
  updateStudentPhotoPath,
  updateStudentRow,
} from "@/modules/students/server/student.repository";

const PHOTO_BUCKET = "student-photos";

async function signedPhotoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await createAdminClient()
    .storage.from(PHOTO_BUCKET)
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

export async function getStudents(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<StudentListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  const { data, error, count } = await listStudentRows(
    from,
    to,
    params.search,
    params.status,
  );
  if (error)
    throw new ApiError(
      "STUDENTS_LOAD_FAILED",
      "Students could not be loaded.",
      500,
    );
  const rows = (data ?? []) as StudentRow[];
  const urls = await Promise.all(
    rows.map((row) => signedPhotoUrl(row.photo_path)),
  );
  return {
    students: rows.map((row, index) => mapStudentSummary(row, urls[index])),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getStudent(id: string): Promise<StudentDetail> {
  const { data, error } = await getStudentRow(id);
  if (error)
    throw new ApiError(
      "STUDENT_LOAD_FAILED",
      "The student could not be loaded.",
      500,
    );
  if (!data) throw new ApiError("STUDENT_NOT_FOUND", "Student not found.", 404);
  const [photoUrl, parents] = await Promise.all([
    signedPhotoUrl(data.photo_path),
    getStudentParents(id),
  ]);
  return { ...mapStudentDetail(data as StudentRow, photoUrl), parents };
}

export async function getStudentMetrics(): Promise<StudentMetricsI> {
  const [total, active, inactive, graduated] = await Promise.all([
    getStudentCount(),
    getStudentCount("active"),
    getStudentCount("inactive"),
    getStudentCount("graduated"),
  ]);
  const failed = [total, active, inactive, graduated].find(
    (result) => result.error,
  );
  if (failed?.error)
    throw new ApiError(
      "STUDENT_METRICS_FAILED",
      "Student metrics could not be loaded.",
      500,
    );
  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    inactive: inactive.count ?? 0,
    graduated: graduated.count ?? 0,
  };
}

function studentInput(input: CreateStudentRequest | UpdateStudentRequest) {
  return {
    first_name: input.firstName.trim(),
    middle_name: nullableText(input.middleName),
    last_name: input.lastName.trim(),
    date_of_birth: input.dateOfBirth,
    gender: input.gender || null,
    admission_date: input.admissionDate,
    status: input.status,
    notes: nullableText(input.notes),
  };
}

export async function createStudent(
  input: CreateStudentRequest,
): Promise<StudentDetail> {
  const { data, error } = await insertStudent({
    admission_number: "",
    ...studentInput(input),
  });
  if (error || !data)
    throw new ApiError(
      "STUDENT_CREATE_FAILED",
      "The student could not be created.",
      500,
    );
  return mapStudentDetail(data as StudentRow);
}

export async function updateStudent(
  id: string,
  input: UpdateStudentRequest,
): Promise<StudentDetail> {
  await getStudent(id);
  const { data, error } = await updateStudentRow(id, studentInput(input));
  if (error || !data)
    throw new ApiError(
      "STUDENT_UPDATE_FAILED",
      "The student could not be updated.",
      500,
    );
  const [photoUrl, parents] = await Promise.all([
    signedPhotoUrl(data.photo_path),
    getStudentParents(id),
  ]);
  return { ...mapStudentDetail(data as StudentRow, photoUrl), parents };
}

export async function uploadStudentPhoto(
  id: string,
  file: File,
): Promise<StudentDetail> {
  const student = await getStudent(id);
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type))
    throw new ApiError(
      "INVALID_PHOTO_TYPE",
      "Use a JPG, PNG or WebP image.",
      422,
    );
  if (file.size > 2 * 1024 * 1024)
    throw new ApiError(
      "PHOTO_TOO_LARGE",
      "The student photo must not exceed 2 MB.",
      422,
    );
  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const path = `${id}/${crypto.randomUUID()}.${extension}`;
  const admin = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from(PHOTO_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploadError)
    throw new ApiError(
      "PHOTO_UPLOAD_FAILED",
      "The student photo could not be uploaded.",
      500,
    );
  const { data, error } = await updateStudentPhotoPath(id, path);
  if (error || !data) {
    await admin.storage.from(PHOTO_BUCKET).remove([path]);
    throw new ApiError(
      "PHOTO_SAVE_FAILED",
      "The student photo could not be saved.",
      500,
    );
  }
  if (student.photoUrl && (data as StudentRow).photo_path !== path) {
    /* old path is intentionally retained if unavailable from DTO */
  }
  return mapStudentDetail(data as StudentRow, await signedPhotoUrl(path));
}
