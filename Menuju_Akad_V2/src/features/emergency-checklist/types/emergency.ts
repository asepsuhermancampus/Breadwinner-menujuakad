export type EmergencyItem = {
  id: string;
  name: string;
  ready: boolean;
};

export type EmergencyBag = {
  id: string;
  name: string;
  pic: string;
  lastChecked: string;
  items: EmergencyItem[];
};
