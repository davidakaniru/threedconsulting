import { LoaderCircle } from "lucide-react";

export default function PortalLoading() {
  return (
    <div className="mx-auto grid min-h-[45vh] w-full max-w-370 place-items-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="size-7 animate-spin text-primary" aria-hidden="true" />
        <div>
          <p className="font-display text-lg font-extrabold text-foreground">Loading portal</p>
          <p className="mt-1 text-sm text-muted-foreground">Fetching the latest information…</p>
        </div>
      </div>
    </div>
  );
}
