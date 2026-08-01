export type ProgrammeTone =
  | "sky"
  | "sun"
  | "grass"
  | "coral"
  | "grape"
  | "teal"
  | "blush";

export type ProgrammeIllustration =
  | "calc"
  | "book"
  | "pencil"
  | "atom"
  | "music"
  | "mic"
  | "paint"
  | "robot"
  | "grad";

export type Programme = {
  slug: string;
  title: string;
  description: string;
  ageGroup: string;
  illustration: ProgrammeIllustration;
  tone: ProgrammeTone;

  overview: string;
  outcomes: string[];
  classSize: string;
  duration: string;
  delivery: string;
  levels: string[];
};

export const programmes: Programme[] = [
  {
    slug: "mathematics",
    title: "Mathematics",
    description:
      "From counting to confident problem-solving with hands-on, visual maths.",
    ageGroup: "Ages 5–14",
    illustration: "calc",
    tone: "sky",
    overview:
      "Our Mathematics programme helps children understand how numbers work rather than simply memorising answers. Through visual demonstrations, practical challenges and guided problem-solving, learners build confidence at every stage.",
    outcomes: [
      "Build strong number and calculation skills",
      "Approach problems with confidence",
      "Understand mathematical concepts visually",
      "Apply maths to everyday situations",
      "Develop speed, accuracy and logical thinking",
      "Prepare confidently for school assessments",
    ],
    classSize: "Maximum 6 learners",
    duration: "60 minutes",
    delivery: "In person or online",
    levels: ["Early Years", "Primary", "Key Stage 3", "Exam Preparation"],
  },
  {
    slug: "english",
    title: "English",
    description: "Grammar, comprehension and a genuine love of language.",
    ageGroup: "Ages 5–14",
    illustration: "book",
    tone: "grass",
    overview:
      "Our English programme develops the reading, writing, vocabulary and comprehension skills children need to communicate confidently. Lessons combine structured language practice with engaging texts and creative activities.",
    outcomes: [
      "Improve grammar and sentence construction",
      "Build a broader vocabulary",
      "Strengthen reading comprehension",
      "Write clearly for different purposes",
      "Communicate ideas with confidence",
      "Prepare for school English assessments",
    ],
    classSize: "Maximum 6 learners",
    duration: "60 minutes",
    delivery: "In person or online",
    levels: ["Early Years", "Primary", "Key Stage 3", "Exam Preparation"],
  },
  {
    slug: "reading",
    title: "Reading",
    description: "Phonics-first reading that turns pages into adventures.",
    ageGroup: "Ages 4–10",
    illustration: "book",
    tone: "coral",
    overview:
      "Our Reading programme helps young learners become fluent, expressive and enthusiastic readers. Children develop phonics, word recognition and comprehension through stories selected for their age and ability.",
    outcomes: [
      "Recognise sounds and blend words",
      "Read with greater fluency",
      "Understand and discuss stories",
      "Build confidence when reading aloud",
      "Develop a wider vocabulary",
      "Build a positive lifelong reading habit",
    ],
    classSize: "Maximum 6 learners",
    duration: "45–60 minutes",
    delivery: "In person or online",
    levels: ["Early Phonics", "Developing Readers", "Fluent Readers"],
  },
  {
    slug: "coding",
    title: "Coding",
    description: "Playful, project-based coding from blocks to real Python.",
    ageGroup: "Ages 7–16",
    illustration: "robot",
    tone: "teal",
    overview:
      "Our Coding programme takes learners from visual block-based programming to building projects with real code. Every lesson combines creativity and computational thinking through games, animations and practical challenges.",
    outcomes: [
      "Understand core programming concepts",
      "Create games, animations and applications",
      "Develop computational thinking",
      "Identify and fix errors independently",
      "Progress from block coding to text-based code",
      "Build a portfolio of practical projects",
    ],
    classSize: "Maximum 6 learners",
    duration: "75 minutes",
    delivery: "In person or live online",
    levels: [
      "Block Coding",
      "Web Development",
      "Python Fundamentals",
      "Advanced Projects",
    ],
  },
  {
    slug: "creative-writing",
    title: "Creative Writing",
    description: "Storytelling, poetry and imagination brought to the page.",
    ageGroup: "Ages 8–15",
    illustration: "pencil",
    tone: "grape",
    overview:
      "Our Creative Writing programme gives young writers the structure and encouragement needed to turn ideas into compelling stories, poems and scripts. Learners explore character, setting, dialogue and editing.",
    outcomes: [
      "Generate and develop original ideas",
      "Create memorable characters and settings",
      "Use descriptive language effectively",
      "Structure stories with clear narratives",
      "Edit and improve written work",
      "Share writing with greater confidence",
    ],
    classSize: "Maximum 6 learners",
    duration: "60 minutes",
    delivery: "In person or online",
    levels: [
      "Young Storytellers",
      "Developing Writers",
      "Advanced Creative Writing",
    ],
  },
  {
    slug: "science",
    title: "Science",
    description: "Safe, wow-filled experiments that spark real curiosity.",
    ageGroup: "Ages 6–14",
    illustration: "atom",
    tone: "teal",
    overview:
      "Our Science programme turns curiosity into discovery through safe experiments, demonstrations and investigations. Learners explore biology, chemistry, physics and the world around them.",
    outcomes: [
      "Ask meaningful scientific questions",
      "Plan and carry out safe experiments",
      "Record and interpret observations",
      "Understand key scientific principles",
      "Connect science with everyday life",
      "Present findings clearly and confidently",
    ],
    classSize: "Maximum 6 learners",
    duration: "75 minutes",
    delivery: "Primarily in person",
    levels: ["Junior Discovery", "Primary Science", "Key Stage 3 Science"],
  },
  {
    slug: "music",
    title: "Music",
    description: "Rhythm, theory and instruments in a joyful ensemble.",
    ageGroup: "Ages 5–14",
    illustration: "music",
    tone: "grape",
    overview:
      "Our Music programme introduces learners to rhythm, melody, performance and musical theory in a relaxed group environment. Children learn through listening, playing and creating together.",
    outcomes: [
      "Develop rhythm and timing",
      "Understand foundational music theory",
      "Build confidence with an instrument",
      "Listen and respond to different styles",
      "Create simple musical compositions",
      "Perform confidently with others",
    ],
    classSize: "Maximum 6 learners",
    duration: "60 minutes",
    delivery: "In person",
    levels: ["Musical Beginnings", "Developing Musicians", "Performance Group"],
  },
  {
    slug: "public-speaking",
    title: "Public Speaking",
    description: "Confidence, clarity and poise for every young voice.",
    ageGroup: "Ages 8–16",
    illustration: "mic",
    tone: "coral",
    overview:
      "Our Public Speaking programme helps young people express their ideas clearly and confidently. Through presentations, debates, storytelling and group activities, learners become more assured communicators.",
    outcomes: [
      "Speak clearly and confidently",
      "Organise ideas into effective presentations",
      "Use body language and vocal variety",
      "Manage public-speaking anxiety",
      "Listen and respond thoughtfully",
      "Participate confidently in debates",
    ],
    classSize: "Maximum 6 learners",
    duration: "60 minutes",
    delivery: "In person or online",
    levels: [
      "Confidence Builders",
      "Young Presenters",
      "Debate and Leadership",
    ],
  },
  {
    slug: "arts-crafts",
    title: "Arts & Crafts",
    description: "Colour, texture and making — creativity without limits.",
    ageGroup: "Ages 4–12",
    illustration: "paint",
    tone: "blush",
    overview:
      "Our Arts & Crafts programme gives children the freedom to experiment with colour, shape, texture and different materials. Every project encourages creativity, patience and personal expression.",
    outcomes: [
      "Explore different artistic materials",
      "Develop fine motor coordination",
      "Express ideas visually",
      "Plan and complete creative projects",
      "Experiment confidently with colour and form",
      "Build pride in original work",
    ],
    classSize: "Maximum 8 learners",
    duration: "60 minutes",
    delivery: "In person",
    levels: ["Little Makers", "Creative Explorers", "Young Artists"],
  },
  {
    slug: "robotics",
    title: "Robotics",
    description: "Build, wire and program robots that really move.",
    ageGroup: "Ages 9–16",
    illustration: "robot",
    tone: "sky",
    overview:
      "Our Robotics programme combines engineering, electronics and coding. Learners work through practical challenges as they design, construct and program machines that respond to the world around them.",
    outcomes: [
      "Understand basic electronics and sensors",
      "Construct working robotic systems",
      "Program movement and behaviour",
      "Test and improve mechanical designs",
      "Solve engineering challenges collaboratively",
      "Present completed robotics projects",
    ],
    classSize: "Maximum 6 learners",
    duration: "90 minutes",
    delivery: "In person",
    levels: [
      "Robotics Foundations",
      "Sensors and Automation",
      "Advanced Robotics Projects",
    ],
  },
  {
    slug: "exam-preparation",
    title: "Exam Preparation",
    description: "Structured, calm preparation for 11+, SATs and GCSEs.",
    ageGroup: "Ages 10–16",
    illustration: "grad",
    tone: "sun",
    overview:
      "Our Exam Preparation programme gives learners a clear revision structure, targeted teaching and regular practice. We identify knowledge gaps, strengthen exam technique and help children approach assessments calmly.",
    outcomes: [
      "Identify and close knowledge gaps",
      "Understand common question formats",
      "Improve time management",
      "Use effective revision strategies",
      "Practise under realistic exam conditions",
      "Approach assessments with confidence",
    ],
    classSize: "Maximum 6 learners",
    duration: "60–90 minutes",
    delivery: "In person or online",
    levels: ["11+ Preparation", "SATs Preparation", "GCSE Preparation"],
  },
];

export function getProgrammeBySlug(slug: string) {
  return programmes.find((programme) => programme.slug === slug);
}
