"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { Project, Task, TaskStatus } from '@/lib/types';
import { projects as initialProjects, tasks as initialTasks } from '@/lib/data';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  getTasksByProjectId: (projectId: string) => Task[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, projectId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  addComment: (taskId: string, comment: { userId: string, content: string }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getTasksByProjectId = useCallback((projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus, projectId: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      return newTasks;
    });
  }, []);
  
  const addComment = useCallback((taskId: string, comment: { userId: string, content: string }) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const newComment = {
          ...comment,
          id: `comment-${Date.now()}`,
          taskId,
          createdAt: new Date().toISOString(),
        };
        return {
          ...task,
          comments: [...task.comments, newComment],
        };
      }
      return task;
    }));
  }, []);

  return (
    <DataContext.Provider value={{ projects, tasks, getTasksByProjectId, updateTaskStatus, getTaskById, addComment }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
