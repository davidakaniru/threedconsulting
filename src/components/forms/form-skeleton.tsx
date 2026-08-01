export function ResetPasswordFormSkeleton() {
  return (
    <div
      aria-label="Loading password-reset form"
      aria-busy="true"
      className="animate-pulse"
    >
      <div className="h-5 w-28 rounded-full bg-primary/10" />

      <div className="mt-8 size-12 rounded-2xl bg-primary/10" />

      <div className="mt-5 h-4 w-36 rounded-full bg-primary/10" />

      <div className="mt-3 h-10 w-3/4 rounded-xl bg-primary/10" />

      <div className="mt-4 h-5 w-full rounded-lg bg-primary/10" />

      <div className="mt-8 space-y-5">
        <div className="h-20 rounded-2xl bg-primary/10" />
        <div className="h-20 rounded-2xl bg-primary/10" />
        <div className="h-12 rounded-2xl bg-primary/10" />
      </div>
    </div>
  );
}
