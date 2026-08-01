import {
  Heart,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AboutValue = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  cardClassName: string;
};

export const aboutValues: AboutValue[] = [
  {
    title: "Children first",
    description:
      "Every decision begins with what will help our learners feel safe, supported and successful.",
    icon: Heart,
    iconClassName: "bg-coral text-white",
    cardClassName: "bg-coral/10",
  },
  {
    title: "Joyful curiosity",
    description:
      "We make space for questions, creativity, experimentation and the excitement of discovery.",
    icon: Lightbulb,
    iconClassName: "bg-warning text-foreground",
    cardClassName: "bg-warning/15",
  },
  {
    title: "Belonging",
    description:
      "Every learner is welcomed, respected and encouraged to participate as their authentic self.",
    icon: Users,
    iconClassName: "bg-purple text-white",
    cardClassName: "bg-purple/10",
  },
  {
    title: "Trust and care",
    description:
      "Parents can rely on our team to provide safe, thoughtful and consistently high-quality support.",
    icon: ShieldCheck,
    iconClassName: "bg-turquoise text-white",
    cardClassName: "bg-turquoise/10",
  },
  {
    title: "Celebrate progress",
    description:
      "We recognise every step forward—not only final results or perfect answers.",
    icon: Sparkles,
    iconClassName: "bg-primary text-white",
    cardClassName: "bg-primary/10",
  },
];
