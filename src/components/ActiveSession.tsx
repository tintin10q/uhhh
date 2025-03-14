import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SessionData, FillerWordEvent } from "@/types";
import {
  addFillerWordEvent,
  endSession,
  calculateSessionStats,
} from "@/lib/session-utils";
import { UhhBarChart } from "./UhhBarChart";

interface ActiveSessionProps {
  session: SessionData;
  onSessionEnd: () => void;
}

export default function ActiveSession({
  session,
  onSessionEnd,
}: ActiveSessionProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // Keep a local copy of events to update UI immediately
  const [localEvents, setLocalEvents] = useState<FillerWordEvent[]>(
    session.events
  );

  // Calculate stats only when needed using useMemo
  const stats = useMemo(() => {
    const updatedSession = { ...session, events: localEvents };
    return calculateSessionStats(updatedSession);
  }, [session, localEvents]);

  // Calculate current minute
  const currentMinute = useMemo(() => {
    return Math.floor(elapsedTime / 60) + 1;
  }, [elapsedTime]);

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = (currentTime - session.startTime) / 1000;
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor((seconds / 60) % 60);
    const secs = Math.floor(seconds % 60);
    const hours = Math.floor(seconds / 3600);
    if (hours) 
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
    else 
      return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Handle filler word button click
  const handleUhhClick = useCallback(() => {
    const newEvent: FillerWordEvent = {
      timestamp: Date.now(),
      type: "uhh",
    };

    // Update local state immediately
    setLocalEvents((prev) => [...prev, newEvent]);

    // Also update in localStorage
    addFillerWordEvent(session.id);
  }, [session.id]);

  // Handle ending the session
  const handleEndSession = useCallback(() => {
    endSession(session.id);
    onSessionEnd();
  }, [session.id, onSessionEnd]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="text-2xl font-semibold">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Uhh</div>
            <div className="text-2xl font-semibold">{stats.totalUhh}</div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Uhh Per Minute</div>
            <div className="text-2xl font-semibold">
              {stats.uhhPerMinute.toFixed(2)}
            </div>
          </div>
        </div>

        <UhhBarChart
          data={stats.minuteByMinuteData}
          currentMinute={currentMinute}
        />

        <div className="pt-4">
          <Button
            size="lg"
            className="h-24 text-2xl font-bold bg-red-400 hover:bg-red-500 dark:bg-blue-400 hover:dark:bg-blue-500 w-full"
            onClick={handleUhhClick}
          >
            Uhhhh
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full bg-black dark:bg-white text-white dark:text-black"
          onClick={handleEndSession}
        >
          End Session
        </Button>
      </CardFooter>
    </Card>
  );
}
