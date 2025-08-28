"use client";

import { useMemo } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useData } from '@/contexts/DataContext';

export function ProjectProgressChart() {
  const { tasks } = useData();

  const chartData = useMemo(() => {
    const doneCount = tasks.filter(t => t.status === 'Done').length;
    const pendingCount = tasks.length - doneCount;
    return [
      { name: 'Completed', value: doneCount, fill: 'hsl(var(--primary))' },
      { name: 'Pending', value: pendingCount, fill: 'hsl(var(--chart-3))' },
    ];
  }, [tasks]);

  const chartConfig = {
    value: { label: 'Tasks' },
    Completed: { label: 'Completed' },
    Pending: { label: 'Pending' },
  };
  
  const totalTasks = useMemo(() => tasks.length, [tasks]);

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
