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