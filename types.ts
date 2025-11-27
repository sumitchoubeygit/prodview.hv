export interface MetricData {
  attendance: string; // "Present" | "Absent" | number
  counselled: number;
  uniqueDials: number;
  talktime: number; // in minutes
  udPlusTt: number; // Combined metric
  productivity: number; // percentage value (e.g., 85.5 for 85.5%)
  admission: number;
  screening: number;
  offer: number;
  overall: number; // percentage value
}

export enum PerformanceStatus {
  POOR = 'Poor', // < 80%
  ACCEPTABLE = 'Acceptable', // 80% - 100%
  GOOD = 'Good' // > 100%
}

export interface LC {
  id: string;
  name: string;
  email: string;
  tlName: string;
  managerName: string;
  metrics: MetricData;
}

export interface TL {
  name: string;
  managerName: string;
  metrics: MetricData;
  lcs: LC[];
}

export interface Manager {
  name: string;
  metrics: MetricData;
  tls: TL[];
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface RawSheetRow {
  Email: string;
  Name: string;
  TL_Name: string;
  Manager_Name: string;
  Attendance: string;
  Counselled: string;
  Unique_Dials: string;
  Talktime: string;
  Admission: string;
  Screening: string;
  Offer: string;
  Overall: string;
}