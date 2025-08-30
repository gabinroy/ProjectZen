
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Project, Task, TaskStatus, User, UserRole, Attachment } from '@/lib/types';
import { projects as initialProjects, tasks as initialTasks, users as initialUsers } from '@/lib/data';
import { useNotifications } from './NotificationContext';
import { differenceInDays } from 'date-fns';
import { useAuth } from './AuthContext';

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
  deleteProject: (projectId: string) => void;
  updateProjectMembers: (projectId: string, memberIds: string[]) => void;
  getProjectById: (projectId: string) => Project | undefined;
  addTask: (task: Omit<Task, 'id' | 'status' | 'comments' | 'creatorId' | 'lastPriorityDueDateUpdater'>) => void;
  deleteTask: (taskId: string) => void;
  addAttachment: (taskId: string, file: File) => void;
  deleteAttachment: (taskId: string, attachmentId: string) => void;
  updateTaskPriorityAndDueDate: (taskId: string, priority: Task['priority'], dueDate: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { addNotification } = useNotifications();
  const { user: currentUser } = useAuth();

  const adminUser = useMemo(() => users.find(u => u.role === 'Admin'), [users]);

  useEffect(() => {
    // Generate notifications for tasks due soon or overdue
    tasks.forEach(task => {
        if (task.status !== 'Done') {
            const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
            let message = '';
            if (daysUntilDue < 0) {
                message = `Task "${task.title}" is overdue!`;
            } else if (daysUntilDue <= 2) {
                message = `Task "${task.title}" is due soon.`;
            }

            if (message) {
                task.assigneeIds.forEach(userId => {
                    addNotification({
                        userId,
                        message,
                        taskId: task.id,
                        projectId: task.projectId,
                    }, true); 
                });
            }
        }
    });
  }, [tasks, addNotification]);

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

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  }, []);

  const updateProjectMembers = useCallback((projectId: string, memberIds: string[]) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const currentMembers = project.memberIds;
    const newMembers = memberIds.filter(id => !currentMembers.includes(id));

    newMembers.forEach(userId => {
        addNotification({
            userId,
            message: `You have been added to the project "${project.name}".`,
            projectId: project.id,
        });
    });

    setProjects(prevProjects => prevProjects.map(p => 
      p.id === projectId ? { ...p, memberIds } : p
    ));
  }, [projects, addNotification]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'comments' | 'creatorId'>) => {
    if (!currentUser) return;
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        status: 'Todo',
        comments: [],
        attachments: task.attachments || [],
        creatorId: currentUser.id,
    };
    
    newTask.assigneeIds.forEach(userId => {
        addNotification({
            userId,
            message: `You have been assigned a new task: "${newTask.title}".`,
            taskId: newTask.id,
            projectId: newTask.projectId,
        });
    });

    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, [addNotification, currentUser]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const addAttachment = useCallback((taskId: string, file: File) => {
    const newAttachment: Attachment = {
      id: `attach-${Date.now()}`,
      fileName: file.name,
      url: URL.createObjectURL(file),
    };
    setTasks(prev => prev.map(t => t.id === taskId ? {...t, attachments: [...t.attachments, newAttachment]} : t));
  }, []);

  const deleteAttachment = useCallback((taskId: string, attachmentId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? {...t, attachments: t.attachments.filter(a => a.id !== attachmentId)} : t));
  }, []);

  const updateTaskPriorityAndDueDate = useCallback((taskId: string, priority: Task['priority'], dueDate: string) => {
      if (!currentUser) return;
      setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
              return {
                  ...t,
                  priority,
                  dueDate,
                  lastPriorityDueDateUpdater: {
                      userId: currentUser.id,
                      role: currentUser.role,
                  }
              }
          }
          return t;
      }))
  }, [currentUser]);


  return (
    <DataContext.Provider value={{ 
        projects, tasks, users, getTasksByProjectId, 
        updateTaskStatus, getTaskById, addComment, addUser, 
        updateUserRole, addProject, deleteProject, updateProjectMembers, getProjectById, 
        addTask, deleteTask, addAttachment, deleteAttachment, updateTaskPriorityAndDueDate
    }}>
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
