export interface FillerWordEvent {
  timestamp: number;
  type: 'uhh';
}

export interface SessionData {
  id: string;
  name: string;
  startTime: number;
  endTime: number | null;
  events: FillerWordEvent[];
  // Version 2
  // which session this is used for the arrows
  index: number;
}

export interface SessionStats {
  totalUhh: number;
  durationMinutes: number;
  uhhPerMinute: number;
  minuteByMinuteData: Array<{
    minute: number;
    uhh: number;
  }>;
} 