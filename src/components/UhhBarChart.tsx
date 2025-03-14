"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface UhhBarChartProps {
  data: Array<{
    minute: number;
    uhh: number;
  }>;
  currentMinute: number;
}

export function UhhBarChart({ data, currentMinute }: UhhBarChartProps) {
  // Ensure we have data for the current minute
  const chartData = [...data];
  
  // If the current minute isn't in the data yet, add it
  if (!chartData.some(item => item.minute === currentMinute)) {
    chartData.push({
      minute: currentMinute,
      uhh: 0
    });
  }

  // If we only have one data point, add a second one because it looks better
  while (chartData.length < 5) {
    chartData.push({
      minute: chartData.length + 1,
      uhh: 0
    });
  }
  
  // Sort by minute
  chartData.sort((a, b) => a.minute - b.minute);
  
  // Find the maximum uhh count for scaling
  const maxUhh = Math.max(...chartData.map(item => item.uhh), 5);
  
  return (
    <Card className="w-full">
      {/* <CardHeader>
        <CardTitle className="text-base">Uhh Count Per Minute</CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="minute" 
                label={{ value: 'Minute', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Uhhs', angle: -90, position: 'insideLeft', offset: 10 }}
                domain={[0, Math.ceil(maxUhh * 1.2)]} // Add 20% padding to the top
              />
              <Tooltip 
                formatter={(value) => [`${value} uhh`]}
                labelFormatter={(label) => `Minute ${label}`}
              />
              <Bar 
                dataKey="uhh" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                className="fill-red-400 dark:fill-blue-400"
                isAnimationActive={false} // Disable animation for better performance
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 