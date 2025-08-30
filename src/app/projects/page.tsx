
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
  const { projects, deleteProject } = useData();
  const { user } = useAuth();
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const visibleProjects = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin') {
      return projects;
    }
    return projects.filter(p => p.memberIds.includes(user.id));
  }, [projects, user]);
  
  const handleDeleteProject = () => {
    if (projectToDelete) {
        deleteProject(projectToDelete);
        toast({
            title: "Project Deleted",
            description: "The project has been successfully deleted.",
        });
        setProjectToDelete(null);
    }
  }


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
          <ProjectCard 
            key={project.id} 
            project={project} 
            onDelete={() => setProjectToDelete(project.id)}
            canDelete={user?.role === 'Admin'}
          />
        ))}
      </div>
      <AddProjectDialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen} />

       <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project and all associated tasks.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </MainLayout>
  );
}
