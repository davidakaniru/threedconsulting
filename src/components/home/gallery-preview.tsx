"use client";

import Image from "next/image";
import { motion } from "motion/react";

type GalleryTile = {
  src: string;
  alt: string;
  tall: boolean;
};

const tiles: GalleryTile[] = [
  {
    src: "/imgs/img1.jpg",
    alt: "Children learning together with their tutor",
    tall: true,
  },
  {
    src: "/imgs/img3.jpg",
    alt: "Children doing a fun science experiment",
    tall: false,
  },
  {
    src: "/imgs/img4.jpg",
    alt: "Kids coding and building robots",
    tall: false,
  },
  {
    src: "/imgs/img2.jpg",
    alt: "A parent reading with their child",
    tall: true,
  },
  {
    src: "/imgs/img5.jpg",
    alt: "Children celebrating graduation",
    tall: false,
  },
  {
    src: "/imgs/img1.jpg",
    alt: "A bright classroom full of curious learners",
    tall: false,
  },
  {
    src: "/imgs/img4.jpg",
    alt: "Collaborative robotics activity",
    tall: true,
  },
  {
    src: "/imgs/img3.jpg",
    alt: "Hands-on discovery time",
    tall: false,
  },
];

export function GalleryPreview() {
  return (
    <section className="bg-[#fff8ee] px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <GalleryMasonry />
      </div>
    </section>
  );
}

function GalleryMasonry() {
  return (
    <div
      className="columns-2 gap-4 [column-fill:balance]
        md:columns-3 lg:columns-4"
    >
      {tiles.map((tile, index) => (
        <motion.figure
          key={`${tile.src}-${index}`}
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-40px",
          }}
          transition={{
            duration: 0.5,
            delay: (index % 4) * 0.06,
          }}
          className="group mb-4 break-inside-avoid
            overflow-hidden rounded-3xl
            shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]"
        >
          <div
            className={
              tile.tall ? "relative aspect-3/4" : "relative aspect-4/3"
            }
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform
                duration-500 group-hover:scale-105"
            />
          </div>
        </motion.figure>
      ))}
    </div>
  );
}

function SectionHeading() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.5,
      }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span
        className="mb-3 inline-block font-display text-sm
          font-bold uppercase tracking-wider text-primary"
      >
        Our gallery
      </span>

      <h2
        className="font-display text-3xl font-extrabold
          leading-tight text-foreground md:text-[2.75rem]"
      >
        A peek into everyday joy
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        Learning, laughter and lightbulb moments — captured across our
        classrooms and events.
      </p>
    </motion.div>
  );
}
