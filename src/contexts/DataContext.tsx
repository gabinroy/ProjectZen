
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Project, Task, TaskStatus, User, UserRole } from '@/lib/types';
import { projects as initialProjects, tasks as initialTasks, users as initialUsers } from '@/lib/data';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  getTasksByProjectId: (projectId: string) => Task[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, projectId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  addComment: (taskId: string, comment: { userId: string, content: string }) => void;
  addUser: (user: Omit<User, 'id' | 'avatarUrl'>) => User;
  updateUserRole: (userId: string, role: UserRole) => void;
  addProject: (project: Omit<Project, 'id' | 'memberIds'>, managerId: string) => void;
  updateProjectMembers: (projectId: string, memberIds: string[]) => void;
  getProjectById: (projectId: string) => Project | undefined;
  addTask: (task: Omit<Task, 'id' | 'status' | 'comments' | 'attachments'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const adminUser = useMemo(() => users.find(u => u.role === 'Admin'), [users]);

  const getTasksByProjectId = useCallback((projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);
  
  const getProjectById = useCallback((projectId: string) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus, projectId:string) => {
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

  const addUser = useCallback((user: Omit<User, 'id' | 'avatarUrl'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      avatarUrl: `https://i.pravatar.cc/150?u=user-${Date.now()}`,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  }, []);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
  }, []);
  
  const addProject = useCallback((project: Omit<Project, 'id' | 'memberIds'>, managerId: string) => {
    if (!adminUser) return;
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      memberIds: [managerId, adminUser.id]
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
  }, [adminUser]);

  const updateProjectMembers = useCallback((projectId: string, memberIds: string[]) => {
    setProjects(prevProjects => prevProjects.map(p => 
      p.id === projectId ? { ...p, memberIds } : p
    ));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'comments' | 'attachments'>) => {
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        status: 'Todo',
        comments: [],
        attachments: [],
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  return (
    <DataContext.Provider value={{ projects, tasks, users, getTasksByProjectId, updateTaskStatus, getTaskById, addComment, addUser, updateUserRole, addProject, updateProjectMembers, getProjectById, addTask }}>
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
