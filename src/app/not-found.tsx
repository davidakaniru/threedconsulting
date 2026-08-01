import Link from "next/link";
import { ArrowLeft, BookOpen, Home, Pen, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      className="relative grid min-h-[calc(100vh-5rem)]
        place-items-center overflow-hidden bg-linear-to-b
        from-sky-50 via-white to-[#fff8ee]
        px-5 py-20 sm:px-8"
    >
      <BackgroundDecorations />

      <div className="relative mx-auto max-w-2xl text-center">
        <div
          className="mx-auto grid size-24 place-items-center
            rounded-[2rem] bg-white
            shadow-[0_20px_60px_-25px_rgba(56,116,189,0.45)]
            sm:size-28"
        >
          <span
            className="font-display text-4xl font-extrabold
              text-sky-500 sm:text-5xl"
          >
            404
          </span>
        </div>

        <span
          className="mt-8 inline-flex items-center gap-2
            rounded-full bg-sky-100 px-4 py-2
            font-display text-sm font-bold text-sky-700"
        >
          <Search aria-hidden="true" className="size-4" />
          Page not found
        </span>

        <h1
          className="mt-5 font-display text-4xl font-extrabold
            leading-tight text-foreground
            sm:text-5xl md:text-6xl"
        >
          Oops, this page went on a{" "}
          <span className="text-sky-500">little adventure</span>
        </h1>

        <p
          className="mx-auto mt-5 max-w-xl text-lg
            leading-relaxed text-muted-foreground"
        >
          The page you’re looking for may have moved, been renamed, or no longer
          exists. Let’s help you find your way back.
        </p>

        <div
          className="mt-8 flex flex-col justify-center gap-3
            sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link href="/">
              <Home data-icon="inline-start" />
              Back to homepage
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/programmes">
              <BookOpen data-icon="inline-start" />
              Explore programmes
            </Link>
          </Button>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2
            font-display text-sm font-bold text-muted-foreground
            transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Return to safety
        </Link>
      </div>
    </main>
  );
}

function BackgroundDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute -left-24 top-16 size-72
          rounded-full bg-sky-200/50 blur-3xl"
      />

      <div
        className="absolute -right-24 bottom-8 size-80
          rounded-full bg-amber-100/70 blur-3xl"
      />

      <Pen
        className="absolute left-[10%] top-[18%]
          size-12 -rotate-12deg text-amber-400/80"
      />

      <BookOpen
        className="absolute bottom-[18%] right-[10%]
          size-14 rotate-12 text-violet-300/80"
      />

      <span
        className="absolute right-[22%] top-[16%]
          size-5 rounded-full bg-coral/50"
      />

      <span
        className="absolute bottom-[25%] left-[18%]
          size-4 rounded-full bg-turquoise/60"
      />

      <span
        className="absolute left-[32%] top-[10%]
          size-3 rounded-full bg-pink/60"
      />
    </div>
  );
}
