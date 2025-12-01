import { FillerWordEvent, SessionData, SessionStats } from "@/types";

// Local storage key
const STORAGE_KEY = "filler-word-sessions";

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Save sessions to localStorage
export function saveSessions(sessions: SessionData[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

// Get sessions from localStorage
export function getSessions(): SessionData[] {
  if (typeof window !== "undefined") {
    // Get protocol id
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        // Add missing indexes if there are not any
      let parsed : SessionData[] = JSON.parse(data);
      let version = localStorage.getItem("version");
      const latestVersion = "1";
      const versionChange = version === latestVersion;

       if (versionChange) {
           if (version === null) { // Update from null to 1
               parsed = parsed.map(((session, index) => { session.index = index; return session; }));
               version = "1";
           }
           if (version === "1") {} // etc as long as you set the version to the next one each time
           if (version === "2") {} // just an example

           localStorage.setItem("version", latestVersion);
           saveSessions(parsed);
      }

      return parsed;
    }
  }
  return [];
}

export function endCurrentActiveSession() {
  const sessions = getSessions();
  const activeSession = sessions.find((s) => s.endTime === null);
  if (activeSession) {
    const closed_at = localStorage.getItem("closedAt");
    const closed_at_num = closed_at ? parseInt(closed_at) : Date.now();
    activeSession.endTime = closed_at_num;
    saveSessions(sessions);
  }
}
// Create a new session
export function createSession(name: string): SessionData {
    const sessions = getSessions();
    const newSession: SessionData = {
        id: generateId(),
        name,
        startTime: Date.now(),
        endTime: null,
        events: [],
        index: sessions.length,
      };
   sessions.push(newSession);
   saveSessions(sessions);

  return newSession;
}

// Add a filler word event to a session
export function addFillerWordEvent(sessionId: string): void {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex !== -1) {
    const event: FillerWordEvent = {
      timestamp: Date.now(),
      type: "uhh",
    };

    sessions[sessionIndex].events.push(event);
    saveSessions(sessions);
  }
}

// End a session
export function endSession(sessionId: string): void {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex !== -1) {
    sessions[sessionIndex].endTime = Date.now();
    saveSessions(sessions);
  }
}

// Delete a session
export function deleteSession(sessionId: string): void {
  const sessions = getSessions();
  const updatedSessions = sessions.filter((s) => s.id !== sessionId);
  saveSessions(updatedSessions);
}

export function deleteAllSessions(): void { saveSessions([]);}

// Format duration as MM:SS
export function formatDuration(minutes: number): string {
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes - mins) * 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Calculate session statistics
export function calculateSessionStats(session: SessionData): SessionStats {
  const endTime = session.endTime || Date.now();
  const durationMs = endTime - session.startTime;
  const durationMinutes = Math.max(durationMs / (1000 * 60), 1);

  const uhhEvents = session.events.filter((e) => e.type === "uhh");

  const totalUhh = uhhEvents.length;

  const uhhPerMinute = durationMinutes > 0 ? totalUhh / durationMinutes : 0;

  // Calculate minute-by-minute data for histogram
  const minuteByMinuteData: Array<{ minute: number; uhh: number }> = [];

  // Only calculate if session has some duration
  if (durationMinutes > 0) {
    const totalMinutes = Math.ceil(durationMinutes);

    for (let i = 0; i < totalMinutes; i++) {
      const minuteStart = session.startTime + i * 60 * 1000;
      const minuteEnd = minuteStart + 60 * 1000;

      const uhhInMinute = uhhEvents.filter(
        (e) => e.timestamp >= minuteStart && e.timestamp < minuteEnd
      ).length;

      minuteByMinuteData.push({
        minute: i + 1,
        uhh: uhhInMinute,
      });
    }
  }

  return {
    totalUhh,
    durationMinutes,
    uhhPerMinute,
    minuteByMinuteData,
  };
}
