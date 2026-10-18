export type FollowUpGuest = {
  id: string;
  name: string;
  category: string;
  side: string;
  quota: number;
  lastWaDate: string;
  consent: "Diberikan" | "Tidak ada" | "Dicabut";
  selected: boolean;
};

export type FollowUpFilters = {
  side: string;
  session: string;
  condition: string;
};
