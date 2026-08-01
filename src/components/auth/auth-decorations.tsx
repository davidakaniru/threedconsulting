import { BookOpen, Rocket, Star } from "lucide-react";

export function AuthDecorations() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0
        overflow-hidden"
    >
      <span
        className="absolute left-[7%] top-[15%]
          hidden rotate-[-10deg] rounded-3xl bg-white/75
          p-4 text-coral shadow-lg backdrop-blur
          xl:block"
      >
        <Rocket className="size-8" />
      </span>

      <span
        className="absolute bottom-[12%] right-[6%]
          hidden rotate-6 rounded-3xl bg-white/75
          p-4 text-purple shadow-lg backdrop-blur
          xl:block"
      >
        <BookOpen className="size-8" />
      </span>

      <span
        className="absolute right-[17%] top-[9%]
          hidden rotate-12 text-yellow-400
          xl:block"
      >
        <Star className="size-10 fill-current" strokeWidth={1.5} />
      </span>
    </div>
  );
}
