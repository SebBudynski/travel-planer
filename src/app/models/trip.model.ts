// src/app/models/trip.model.ts
export interface Trip {
  id: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  dayPlans: DayPlan[];
  packingList: PackingItem[];
  importantInfo: ImportantInfo[];
}

export interface DayPlan {
  date: string;
  activities: string[];
}

export interface PackingItem {
  name: string;
  packed: boolean;
}

export interface ImportantInfo {
  category: string;
  details: string;
}