export function TableLoading({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5" aria-label="Loading records" aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}
