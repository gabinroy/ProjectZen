"use client";

import { useData } from "@/contexts/DataContext";
import { KanbanColumn } from "./KanbanColumn";
import { statuses } from "@/lib/data";
import type { TaskStatus } from "@/lib/types";
import { useState } from "react";

export function KanbanBoard({ projectId }: { projectId: string }) {
  const { getTasksByProjectId, updateTaskStatus } = useData();
  const tasks = getTasksByProjectId(projectId);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status, projectId);
      setDraggedTaskId(null);
    }
  };
  
  if(!tasks) return <p>Loading tasks...</p>

  return (
    <div className="flex h-full flex-1 gap-6 overflow-x-auto p-1">
      {statuses.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
}
