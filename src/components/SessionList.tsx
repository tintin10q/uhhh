import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionData } from "@/types";
import {
  deleteSession,
  calculateSessionStats,
  endSession,
  deleteAllSessions,
} from "@/lib/session-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { StatsText } from "./StatsText";

interface SessionListProps {
  sessions: SessionData[];
  onSessionSelect: (session: SessionData) => void;
  onSessionsChange: () => void;
  viewAllTab: () => void,
}

export default function SessionList({
  sessions,
  onSessionSelect,
  onSessionsChange,
  viewAllTab,
}: SessionListProps) {
  // Sort sessions by start time (newest first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.startTime - a.startTime);
  }, [sessions]);

  // Format date

  // Handle session deletion
  function handleDeleteSession(sessionId: string) {
    deleteSession(sessionId);
    onSessionsChange();
  }

  function handleEndSession(sessionId: string) {
    endSession(sessionId);
    onSessionsChange();
  }

  function handleDeleteAllSessions() {
    deleteAllSessions();
    onSessionsChange();
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between align-middle items-center">
            <span className="self-center text-2xl">Session History</span>
            {sessions.length > 1 && (
              <div className="self-end flex gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={viewAllTab}
                  >
                      View All
                  </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      Delete All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the <b>ALL</b> sessions!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive"
                        onClick={() => handleDeleteAllSessions()}
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSessions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No sessions yet. Start a new session to begin tracking filler words.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session) => {
              const stats = calculateSessionStats(session);
              const isActive = session.endTime === null;

              return (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg ${
                    isActive ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex items-center  justify-between [@media(max-width:480px)]:justify-center">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {session.name}
                        {isActive ? (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteSession(session.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                        )}
                      </h3>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(session.startTime)} at{" "}
                        {formatTime(session.startTime)}
                      </div>
                      {stats.totalUhh > 0 ? (
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">
                            <span className="text-lg">{stats.totalUhh}</span>{" "}
                            <span className="text-xs">Uhh </span>
                          </Badge>
                          <Badge variant="outline">
                            <span className="text-lg">
                              {stats.uhhPerMinute.toFixed(2)}
                            </span>{" "}
                            <span className="text-xs">uhh/min</span>
                          </Badge>
                        </div>
                      ) : (
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">
                            <span className="text-lg">{stats.totalUhh}</span>{" "}
                            <span className="text-xs">Uhh </span>
                          </Badge>
                          <Badge variant="outline">
                            <span className="text-md">Perfect 🎉</span>
                          </Badge>
                        </div>
                      )}
                    </div>
                    {!isActive && (
                      <div className="[@media(orientation:portrait)_and_(max-width:481px)]:hidden">
                        <StatsText stats={stats}></StatsText>
                      </div>
                    )}
                    <div className="flex space-x-4 self-center">
                      {isActive ? (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            handleEndSession(session.id);
                          }}
                          className="self-center [@media(orientation:portrait)_and_(max-width:481px)]:hidden"
                        >
                          End Session
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => onSessionSelect(session)}
                          className="self-center [@media(orientation:landscape)]:block hidden"
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="hidden [@media(orientation:portrait)]:flex flex-col items-center">
                    {!isActive && (
                      <div className="[@media(orientation:portrait)_and_(max-width:480px)]:block hidden">
                        <StatsText stats={stats}></StatsText>
                      </div>
                    )}

                    {!isActive && (
                      <div className="w-full pt-2">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => onSessionSelect(session)}
                          className="block w-full"
                        >
                          View
                        </Button>
                      </div>
                    )}
                    {isActive && (
                      <div className="w-full block pt-2 [@media(orientation:portrait)_and_(max-width:481px)]:block hidden">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            handleEndSession(session.id);
                          }}
                          className="self-center w-full "
                        >
                          End Session
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
