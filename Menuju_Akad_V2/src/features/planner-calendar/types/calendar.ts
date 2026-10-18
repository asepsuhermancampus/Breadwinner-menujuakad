export type CalendarEventItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  venue: string;
  pic: string;
  type: "meeting" | "fitting" | "deadline" | "general";
  conflictWith?: string;
};
