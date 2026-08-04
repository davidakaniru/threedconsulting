const DEFAULT_LOCALE = "en-GB";

export function formatDate(value: string | Date) {
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function formatRelative(value: string | Date, now = new Date()) {
  const date = new Date(value);
  const diffMs = date.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, { numeric: "auto" });

  if (absMs < 60 * 60 * 1000) return rtf.format(Math.round(diffMs / (60 * 1000)), "minute");
  if (absMs < 24 * 60 * 60 * 1000) return rtf.format(Math.round(diffMs / (60 * 60 * 1000)), "hour");
  if (absMs < 30 * 24 * 60 * 60 * 1000) return rtf.format(Math.round(diffMs / (24 * 60 * 60 * 1000)), "day");
  return formatDate(date);
}
