import type { ComponentType } from "react";

import {
  AtomIllustration,
  BookIllustration,
  CalculatorIllustration,
  GraduationCapIllustration,
  MicrophoneIllustration,
  MusicIllustration,
  PaintIllustration,
  PencilIllustration,
  RobotIllustration,
} from "@/components/home/hero-illustrations";
import type { ProgrammeIllustration } from "@/data/programmes";

type IllustrationProps = {
  className?: string;
};

type ProgrammeIllustrationProps = {
  name: ProgrammeIllustration;
  className?: string;
};

const illustrationMap: Record<
  ProgrammeIllustration,
  ComponentType<IllustrationProps>
> = {
  calc: CalculatorIllustration,
  book: BookIllustration,
  pencil: PencilIllustration,
  atom: AtomIllustration,
  music: MusicIllustration,
  mic: MicrophoneIllustration,
  paint: PaintIllustration,
  robot: RobotIllustration,
  grad: GraduationCapIllustration,
};

export function ProgrammeIllustration({
  name,
  className,
}: ProgrammeIllustrationProps) {
  const Illustration = illustrationMap[name];

  return <Illustration className={className} />;
}
