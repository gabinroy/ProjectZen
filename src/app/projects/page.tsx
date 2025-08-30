"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";

export default function ProjectsPage() {
  const { projects } = useData();
  const { user } = useAuth();
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);

  const visibleProjects = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin') {
      return projects;
    }
    return projects.filter(p => p.memberIds.includes(user.id));
  }, [projects, user]);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {user?.role === 'Admin' && (
          <Button onClick={() => setIsAddProjectDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <AddProjectDialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen} />
    </MainLayout>
  );
}
