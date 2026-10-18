export type RundownItem = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  source: string;
  pic: string;
  duration: string;
  isAnchor?: boolean;
};

export type RundownGeneratorConfig = {
  bufferMinutes: number;
  lockAnchors: boolean;
  respectVendorConstraints: boolean;
};
