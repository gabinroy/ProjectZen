export type UserRole = 'Admin' | 'Manager' | 'Team Member';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  role: UserRole;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id:string;
  fileName: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assigneeIds: string[];
  comments: Comment[];
  attachments: Attachment[];
  projectId: string;
  creatorId: string;
  lastPriorityDueDateUpdater?: {
    userId: string;
    role: UserRole;
  }
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  taskId?: string;
  projectId?: string;
  createdAt: string;
  read: boolean;
}
