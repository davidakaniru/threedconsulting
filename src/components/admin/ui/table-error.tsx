import { Button } from "@/components/ui/button";

export function TableError({
  title = "Records could not be loaded",
  description = "Please check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
}) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <h3 className="font-display text-lg font-extrabold text-rose-700">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}
