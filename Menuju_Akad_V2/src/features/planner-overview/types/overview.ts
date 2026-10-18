export type PlannerEventContext = "wedding" | "engagement";

export type PlanningMetricData = {
  id: string;
  label: string;
  value: string;
  detail: string;
  isMono?: boolean;
};

export type FocusTaskItem = {
  id: string;
  title: string;
  pic: "Andi" | "Risa" | "Bersama";
  dueDate: string;
  completed: boolean;
};

export type UpcomingAgendaItem = {
  id: string;
  day: string;
  time: string;
  title: string;
  venue: string;
};

export type PlannerOverviewData = {
  dateContext: string;
  greeting: string;
  countdownLabel: string;
  eventDetail: string;
  readinessPercent: number;
  readinessLabel: string;
  metrics: PlanningMetricData[];
  focusTasks: FocusTaskItem[];
  upcomingAgenda: UpcomingAgendaItem[];
  bannerMessage: string;
  rundownHintTitle: string;
  rundownHintDetail: string;
  partnerActivity: string;
};
