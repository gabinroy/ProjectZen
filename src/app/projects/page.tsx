"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useData } from "@/contexts/DataContext";

export default function ProjectsPage() {
  const { projects } = useData();

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </MainLayout>
  );
}
