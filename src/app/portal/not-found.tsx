import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalNotFound() {
  return (
    <div className="mx-auto grid min-h-[45vh] w-full max-w-370 place-items-center">
      <div className="w-full max-w-lg rounded-3xl border bg-background p-7 text-center shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <FileQuestion className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">This portal page may have moved or is no longer available.</p>
        <Button asChild className="mt-6">
          <Link href="/portal">Return to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
