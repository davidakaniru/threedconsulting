/** Removes PostgREST filter punctuation while preserving normal search text. */
export function sanitizeFilterTerm(value: string | null | undefined): string {
  return value?.trim().replace(/[%(),]/g, "") ?? "";
}
