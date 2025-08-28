"use client";

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useData } from '@/contexts/DataContext';

export function TasksByStatusChart() {
  const { tasks } = useData();

  const chartData = useMemo(() => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { status: 'Todo', count: statusCounts['Todo'] || 0 },
      { status: 'In Progress', count: statusCounts['In Progress'] || 0 },
      { status: 'Done', count: statusCounts['Done'] || 0 },
    ];
  }, [tasks]);

  const chartConfig = {
    count: {
      label: 'Tasks',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false}/>
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
