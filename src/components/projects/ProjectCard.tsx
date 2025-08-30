
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import { useData } from "@/contexts/DataContext";
import { users } from "@/lib/data";
import { ArrowRight, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react";


interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
  canDelete: boolean;
}

export function ProjectCard({ project, onDelete, canDelete }: ProjectCardProps) {
  const { tasks } = useData();
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
  const projectUsers = users.filter(u => project.memberIds.includes(u.id));

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex flex-row items-start justify-between">
         <div className="flex-1">
            <CardTitle className="truncate">{project.name}</CardTitle>
            <CardDescription className="h-10 text-ellipsis overflow-hidden pt-1">
            {project.description}
            </CardDescription>
         </div>
         {canDelete && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
         )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-2">Progress</div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full flex-grow rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {projectUsers.slice(0, 3).map(user => (
            <Avatar key={user.id} className="h-8 w-8 border-2 border-card">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/projects/${project.id}`}>
            View Board <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
