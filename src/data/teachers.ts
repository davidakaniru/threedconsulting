
export type TutorTone = "sky" | "sun" | "grass" | "coral" | "grape" | "teal" | "blush";

export type Teacher = {
  name: string;
  speciality: string;
  experience: string;
  fact: string;
  tone: TutorTone;
  initials: string;
};

export const teachers: Teacher[] = [
  {
    name: "Amara Okafor",
    speciality: "Mathematics & 11+",
    experience: "12 years teaching",
    fact: "Can solve a Rubik’s cube in under a minute.",
    tone: "sky",
    initials: "AO",
  },
  {
    name: "Daniel Reyes",
    speciality: "Coding & Robotics",
    experience: "9 years teaching",
    fact: "Built a robot that waters his plants.",
    tone: "teal",
    initials: "DR",
  },
  {
    name: "Priya Sharma",
    speciality: "English & Creative Writing",
    experience: "11 years teaching",
    fact: "Has written three children’s books.",
    tone: "grape",
    initials: "PS",
  },
  {
    name: "Grace Bennett",
    speciality: "Science & Discovery",
    experience: "8 years teaching",
    fact: "Once ran a school volcano festival.",
    tone: "coral",
    initials: "GB",
  },
  {
    name: "Marcus Lee",
    speciality: "Music & Performance",
    experience: "10 years teaching",
    fact: "Plays five instruments.",
    tone: "sun",
    initials: "ML",
  },
  {
    name: "Sofia Martins",
    speciality: "Public Speaking",
    experience: "7 years teaching",
    fact: "Former national debate champion.",
    tone: "blush",
    initials: "SM",
  },
];
