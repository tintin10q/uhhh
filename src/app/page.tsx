"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SessionData } from "@/types";
import { endCurrentActiveSession, getSessions } from "@/lib/session-utils";
import ActiveSession from "@/components/ActiveSession";
import SessionStats from "@/components/SessionStats";
import SessionList from "@/components/SessionList";
import NewSessionForm from "@/components/NewSessionForm";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";
import { NoScript } from "@/components/NoScript";

export default function Home() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Close an active session if it's the first time the page is opened
  if (typeof window !== "undefined" && !sessionStorage.getItem("openedAt")) {
    sessionStorage.setItem("openedAt", Date.now().toString());
    endCurrentActiveSession();
  }

  // Safe the time when the page is closed so we can close the active session if needed
  useEffect(() => {
    function handleBeforeUnload() {
      localStorage.setItem("closedAt", Date.now().toString());
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Load sessions from localStorage
  const loadSessions = useCallback(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);

    // Check if there's an active session
    const activeSession = loadedSessions.find((s) => s.endTime === null);
    if (activeSession) {
      setActiveSessionId(activeSession.id);

      // If current tab is 'new', switch to 'active' when an active session is found
      if (activeTab === "new") {
        setActiveTab("active");
      }
    } else {
      setActiveSessionId(null);

      // If there are no sessions, default to 'new' tab
      if (
        loadedSessions.length === 0 &&
        (activeTab === "dashboard" || activeTab === "stats")
      ) {
        setActiveTab("new");
      }
    }
  }, [activeTab]);

  // Load sessions on initial render
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Update activeTab if it's 'new' and there's an active session
  useEffect(() => {
    if (activeSessionId && activeTab === "new") {
      setActiveTab("active");
    }

    // If there are no sessions, switch to 'new' tab
    if (
      sessions.length === 0 &&
      (activeTab === "dashboard" || activeTab === "stats")
    ) {
      setActiveTab("new");
    }
  }, [activeSessionId, activeTab, sessions.length]);

  // Handle session creation
  function handleSessionCreated(sessionId: string) {
    loadSessions();
    setActiveSessionId(sessionId);
    setActiveTab("active");
  };

  // Handle session end
  function handleSessionEnd() {
    loadSessions();
    setActiveSessionId(null);
    setActiveTab("dashboard");
  };

  // Handle session selection for viewing stats
  function handleSessionSelect(session: SessionData)  {
    setSelectedSession(session);
    setActiveTab("stats");
  };

  // Get the active session
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Determine if we should show dashboard and stats tabs
  const hasAnySessions = sessions.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <div className="flex justify-end gap-2 mb-4">
            <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open("https://github.com/tintin10q/uhhh", "_blank")}>
            <Github className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-360 dark:scale-100" />
            <span className="sr-only">Open Github</span>
          </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Filler Word Counter
            </h1>
            <p className="text-muted-foreground mt-2">
              Track &ldquo;uhh&rdquo; filler words during public speaking
            </p>
          </div>
        </header>

        <NoScript />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-3xl mx-auto"
        >
          {hasAnySessions && (
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                {<TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
                {activeSessionId && (
                  <TabsTrigger value="active">
                    Active Session{" "}
                    {activeSession?.name ? `(${activeSession.name})` : ""}
                  </TabsTrigger>
                )}
                {!activeSessionId && (
                  <TabsTrigger value="new">New Session</TabsTrigger>
                )}
              </TabsList>

              {!activeSessionId && (
                <Button onClick={() => setActiveTab("new")}>
                  Start New Session
                </Button>
              )}
            </div>
          )}

          {hasAnySessions && (
            <TabsContent value="dashboard" className="mt-0">
              <SessionList
                sessions={sessions}
                onSessionSelect={handleSessionSelect}
                onSessionsChange={loadSessions}
              />
            </TabsContent>
          )}

          <TabsContent value="active" className="mt-0">
            {activeSession && (
              <ActiveSession
                session={activeSession}
                onSessionEnd={handleSessionEnd}
              />
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            {selectedSession && <SessionStats session={selectedSession} />}
          </TabsContent>

          {!activeSessionId && (
            <TabsContent value="new" className="mt-0">
              <NewSessionForm onSessionCreated={handleSessionCreated} />
            </TabsContent>
          )}
        </Tabs>

        <div className="p-8"></div>
        <Separator className="my-8" />

        <footer className="text-center text-sm text-muted-foreground">
          <p>
            Filler Word Counter by Quinten Cabo &copy;{" "}
            {new Date().getFullYear()}
          </p>
          <p className="mt-1">
            Track your &ldquo;uhh&rdquo; filler words to improve your public
            speaking skills.
          </p>
        </footer>
      </div>
    </main>
  );
}
