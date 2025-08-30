"use client";

import type { DragEvent } from 'react';
import { useState } from 'react';
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (status: TaskStatus) => void;
  onDragStart: (taskId: string) => void;
  projectId: string;
}

export function KanbanColumn({ status, tasks, onDrop, onDragStart, projectId }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(status);
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex w-72 shrink-0 flex-col rounded-lg",
          isOver ? 'bg-secondary' : ''
        )}
      >
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold text-md">{status}</h3>
          <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
            {tasks.length}
          </span>
        </div>
        <div className="flex flex-col gap-3 p-3 pt-0">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
          ))}
          {status === 'Todo' && (
             <Button variant="outline" className="w-full" onClick={() => setIsAddTaskDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
             </Button>
          )}
        </div>
      </div>
      <AddTaskDialog 
        projectId={projectId}
        open={isAddTaskDialogOpen} 
        onOpenChange={setIsAddTaskDialogOpen} 
      />
    </>
  );
}
