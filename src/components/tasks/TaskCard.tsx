"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { useState } from 'react';
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
}

const priorityClasses: Record<Task['priority'], string> = {
    High: "bg-red-500/20 text-red-700 dark:text-red-400",
    Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    Low: "bg-green-500/20 text-green-700 dark:text-green-400"
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const assignees = users.filter(u => task.assigneeIds.includes(u.id));

  return (
    <>
    <Card
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={() => setIsDialogOpen(true)}
      className="cursor-pointer transition-shadow hover:shadow-lg"
    >
      <CardContent className="p-4 space-y-3">
        <p className="font-semibold leading-tight">{task.title}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("border-none", priorityClasses[task.priority])}>{task.priority}</Badge>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
                {assignees.map(user => (
                    <Avatar key={user.id} className="h-7 w-7 border-2 border-card">
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {task.comments.length > 0 && (
                    <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4"/>{task.comments.length}</span>
                )}
                {task.attachments.length > 0 && (
                    <span className="flex items-center gap-1"><Paperclip className="h-4 w-4"/>{task.attachments.length}</span>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
    <TaskDetailsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} taskId={task.id} />
    </>
  );
}
