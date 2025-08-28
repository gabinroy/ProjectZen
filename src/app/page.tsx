"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Stats } from "@/components/dashboard/Stats";
import { TasksByStatusChart } from "@/components/dashboard/TasksByStatusChart";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <Stats />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksByStatusChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectProgressChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
