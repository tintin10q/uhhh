import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createSession } from '@/lib/session-utils';

interface NewSessionFormProps {
  onSessionCreated: (sessionId: string) => void;
}

export default function NewSessionForm({ onSessionCreated }: NewSessionFormProps) {
  const [sessionName, setSessionName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sessionName.trim()) {
      const newSession = createSession(sessionName.trim());
      onSessionCreated(newSession.id);
      setSessionName('');
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="session-name" className="text-md font-medium" >
                New Session Name:
              </label>
              <br/>
              <input
                id="session-name"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Their name, Conference Talk, Team Meeting"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground pb-2">
                Give your session a descriptive name to help identify it later.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!sessionName.trim()}>
            Start Tracking
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 