
type EventTone = "sky" | "sun" | "grass" | "coral" | "grape" | "teal" | "blush";

export type EventItem = {
  title: string;
  type: string;
  date: string;
  time: string;
  tone: EventTone;
  spots: string;
};

export const events: EventItem[] = [
  {
    title: "Little Scientists Workshop",
    type: "Workshop",
    date: "Sat 8 Aug",
    time: "10:00 – 12:00",
    tone: "teal",
    spots: "6 spots left",
  },
  {
    title: "Summer Coding Camp",
    type: "Holiday Camp",
    date: "Mon 17 Aug",
    time: "Full week",
    tone: "sky",
    spots: "Enrolling now",
  },
  {
    title: "Young Writers Competition",
    type: "Competition",
    date: "Fri 4 Sep",
    time: "All day",
    tone: "grape",
    spots: "Open to all",
  },
  {
    title: "Family Open Day",
    type: "Open Day",
    date: "Sun 13 Sep",
    time: "11:00 – 15:00",
    tone: "coral",
    spots: "Free entry",
  },
  {
    title: "Weekend Robotics Club",
    type: "Learning Club",
    date: "Every Sat",
    time: "13:00 – 14:30",
    tone: "sun",
    spots: "Termly",
  },
  {
    title: "Maths Masters Challenge",
    type: "Competition",
    date: "Sat 26 Sep",
    time: "10:00 – 12:00",
    tone: "blush",
    spots: "Ages 9+",
  },
];
