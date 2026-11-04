export type VidingTemplate = {
  id: number;
  themeNumber: number;
  name: string;
  description: string;
  categoryGroup: number;
  categoryLabel: string;
  image: string;
  remoteImage: string;
  previewUrl: string;
  tags: string[];
  features: string[];
};

export type CategoryFilter = {
  id: number;
  label: string;
  rangeText: string;
  count: number;
};

