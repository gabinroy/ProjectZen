"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <MainLayout>
      <KanbanBoard projectId={params.id} />
    </MainLayout>
  );
}
