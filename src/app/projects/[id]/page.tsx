"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { ProjectTeamManagement } from "@/components/projects/ProjectTeamManagement";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { getProjectById } = useData();
  const { user } = useAuth();

  const project = getProjectById(params.id);

  if (!project) {
    return (
        <MainLayout>
            <div className="flex items-center justify-center h-full">
                <p>Project not found.</p>
            </div>
        </MainLayout>
    );
  }

  const canManageTeam = user?.role === 'Admin' || user?.id === project.ownerId;

  return (
    <MainLayout>
        <div className="flex flex-col h-full gap-6">
            {canManageTeam && <ProjectTeamManagement projectId={params.id} />}
            <div className="flex-grow">
                <KanbanBoard projectId={params.id} />
            </div>
        </div>
    </MainLayout>
  );
}
