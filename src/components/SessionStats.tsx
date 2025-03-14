import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionData } from '@/types';
import { calculateSessionStats, formatDuration } from '@/lib/session-utils';
import { UhhBarChart } from './UhhBarChart';
import { formatDate, formatDateTime, formatTime} from '@/lib/utils';

interface SessionStatsProps {
  session: SessionData;
}

export default function SessionStats({ session }: SessionStatsProps) {
  // Use useMemo to calculate stats only when session changes
  const stats = useMemo(() => calculateSessionStats(session), [session]); 
  
  // Calculate the last minute of the session
  const lastMinute = useMemo(() => {
    return Math.ceil(stats.durationMinutes);
  }, [stats.durationMinutes]);

  
  const sameday = useMemo(() => {
    if (!session.endTime) 
      return false;

    const d1 = new Date(session.startTime); // Convert seconds to milliseconds
    const d2 = new Date(session.endTime); // Convert seconds to milliseconds
  
    console.log(d1, d2);
    console.log(d1.getUTCFullYear() ,d2.getUTCFullYear() ,
            d1.getUTCMonth() ,d2.getUTCMonth(),
            d1.getUTCDay() , d2.getUTCDay());

    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDay() === d2.getUTCDay();
  }, [session.startTime, session.endTime]);

  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle><span className='text-md font-bold pr-2'>Session Statistics: {session.name}</span>
        {typeof window !== 'undefined' && window.innerWidth < 520 && <br></br>}
        <span className="text-sm text-muted-foreground">
          {session.endTime && sameday ? <span>{formatDate(session.startTime)} {formatTime(session.startTime)} till {formatTime(session.endTime)}</span> 
          : <span>{formatDateTime(session.startTime)} {session.endTime && <>till {formatDateTime(session.endTime)}</>}</span>}
        </span>

        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="text-2xl font-semibold">{formatDuration(stats.durationMinutes)}</div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Uhh</div>
            <div className="text-2xl font-semibold">{stats.totalUhh}</div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Uhh Per Minute</div>
            <div className="text-2xl font-semibold">{stats.uhhPerMinute.toFixed(2)}</div>
          </div>
        </div>
                
        {stats.minuteByMinuteData.length > 0 && (
          <UhhBarChart 
            data={stats.minuteByMinuteData} 
            currentMinute={lastMinute}
          />
        )}
      </CardContent>
    </Card>
  );
} 