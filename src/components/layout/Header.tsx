"use client";

import { Bell, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserNav } from './UserNav';
import { usePathname, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { SidebarTrigger } from '../ui/sidebar';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

function getTitle(pathname: string, projects: any[]) {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/projects') return 'Projects';
    if (pathname === '/settings') return 'Settings';
    if (pathname.startsWith('/projects/')) {
        const projectId = pathname.split('/')[2];
        const project = projects.find(p => p.id === projectId);
        return project ? `Project: ${project.name}`: 'Project';
    }
    return 'ProjectZen';
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { projects } = useData();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const title = getTitle(pathname, projects);

  const userNotifications = notifications.filter(n => n.userId === user?.id);

  const handleNotificationClick = (notificationId: string, projectId?: string, taskId?: string) => {
    markAsRead(notificationId);
    if (projectId) {
      router.push(`/projects/${projectId}`);
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
       <SidebarTrigger className="md:hidden"/>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
             <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium">Notifications</h4>
                {unreadCount > 0 && <Button variant="link" size="sm" className="h-auto p-0" onClick={markAllAsRead}>Mark all as read</Button>}
             </div>
             <ScrollArea className="h-96">
                {userNotifications.length > 0 ? (
                    <div className="divide-y">
                        {userNotifications.map(n => (
                            <div 
                                key={n.id} 
                                className={cn("p-4 hover:bg-secondary cursor-pointer", !n.read && "bg-blue-50 dark:bg-blue-950/50")}
                                onClick={() => handleNotificationClick(n.id, n.projectId, n.taskId)}
                            >
                                <div className="flex items-start gap-3">
                                    {!n.read && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5"></div>}
                                    <div className={cn("flex-1", n.read && "pl-5")}>
                                        <p className="text-sm">{n.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-4">
                        <AlertCircle className="h-10 w-10" />
                        <p>You have no new notifications</p>
                    </div>
                )}
             </ScrollArea>
          </PopoverContent>
        </Popover>
        <UserNav />
      </div>
    </header>
  );
}
