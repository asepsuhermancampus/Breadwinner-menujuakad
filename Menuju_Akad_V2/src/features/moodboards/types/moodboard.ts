export type MoodboardItem = {
  id: string;
  title: string;
  category: "Dekorasi" | "Busana" | "Detail";
  subtitle: string;
  imageSrc?: string;
  notes?: string;
  vendorRef?: string;
};

export type AgreedColor = {
  hex: string;
  name: string;
  role: string;
};
